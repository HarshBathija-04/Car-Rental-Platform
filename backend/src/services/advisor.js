import Groq from 'groq-sdk';
import { config } from '../config.js';
import { HttpError } from '../errors.js';
import { searchCars } from './cars.js';

export const ADVISOR_MODEL = 'openai/gpt-oss-120b';

let client;
const groq = () => (client ??= new Groq({ apiKey: config.groqApiKey, timeout: 20_000, maxRetries: 1 }));

const fleetSummary = (cars) =>
  cars.map((c) => ({
    id: c.id,
    name: `${c.year} ${c.make} ${c.model}`,
    category: c.category,
    seats: c.seats,
    fuel: c.fuel,
    transmission: c.transmission,
    kmpl: c.efficiencyKmpl,
    pricePerDayInr: c.pricePerDay,
    city: c.city,
    features: c.features,
  }));

/** Parses the model output and keeps only ids that exist in the fleet. */
export function parseAdvice(raw, fleetIds) {
  let data;
  try {
    data = JSON.parse(raw);
  } catch {
    return { reply: String(raw || '').slice(0, 800), carIds: [] };
  }
  const known = new Set(fleetIds);
  const carIds = [...new Set((Array.isArray(data.carIds) ? data.carIds : []).map(Number))]
    .filter((id) => known.has(id))
    .slice(0, 3);
  return { reply: String(data.reply || '').slice(0, 800), carIds };
}

export async function recommendCars(message) {
  if (!config.groqApiKey) {
    throw new HttpError(503, 'AI_UNAVAILABLE', 'The trip advisor is not configured right now');
  }
  const cars = await searchCars({});
  let completion;
  try {
    completion = await groq().chat.completions.create({
      model: ADVISOR_MODEL,
      temperature: 0.4,
      max_completion_tokens: 700,
      reasoning_effort: 'low',
      response_format: { type: 'json_object' },
      messages: [
        {
          role: 'system',
          content:
            'You are the Ridex rental advisor for a self-drive car rental company in India. ' +
            'Recommend at most 3 cars, only from the fleet JSON below, that best fit the customer trip. ' +
            'Consider passengers, luggage, terrain, budget (prices are INR per day) and city. ' +
            'If nothing fits, say so politely and suggest the closest option. Never invent cars, prices or discounts. ' +
            'Answer only about car rental; decline anything else briefly. ' +
            'Refer to cars by year, make and model; never mention internal ids in the reply text. ' +
            'Respond with JSON: {"reply": "<= 90 words, friendly, explains why", "carIds": [number]}.\n' +
            `Fleet: ${JSON.stringify(fleetSummary(cars))}`,
        },
        { role: 'user', content: message },
      ],
    });
  } catch (err) {
    if (err?.status === 429) {
      throw new HttpError(429, 'AI_RATE_LIMITED', 'The advisor is busy right now, please try again in a minute');
    }
    console.error('groq request failed:', err?.status, err?.message);
    throw new HttpError(502, 'AI_FAILED', 'The advisor could not answer right now, please try again');
  }
  return parseAdvice(
    completion.choices?.[0]?.message?.content,
    cars.map((c) => c.id),
  );
}
