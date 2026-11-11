import { Link } from 'react-router-dom';
import { REPO_URL } from '../lib/constants.js';

const PILLARS = [
  {
    icon: 'calendar-number-outline',
    title: 'Availability first',
    text: 'Search starts with dates, so you only see cars you can actually drive away in.',
  },
  {
    icon: 'lock-closed-outline',
    title: 'No double bookings',
    text: 'Each booking runs in a database transaction that locks the car, so two people cannot grab the same dates.',
  },
  {
    icon: 'sparkles-outline',
    title: 'Advice grounded in the fleet',
    text: 'The trip advisor only recommends cars that exist, at the prices you see.',
  },
];

const STACK = [
  ['Frontend', 'React 19, React Router, Vite, hand-built CSS design system'],
  ['API', 'Node.js, Express 5, zod validation, JWT auth with bcrypt'],
  ['Data', 'PostgreSQL with schema-scoped migrations and a seeded demo fleet'],
  ['AI', 'Groq (gpt-oss-120b) called only from the server'],
  ['Hosting', 'Vercel for the web app, Render for the API, one shared PostgreSQL database'],
];

export default function About() {
  return (
    <div className="page">
      <div className="container container--narrow prose">
        <p className="eyebrow">About Ridex</p>
        <h1 className="page__title">Car rental without the back-and-forth</h1>
        <p className="lead">
          Ridex is a self-drive rental platform for Mumbai, Pune and Bengaluru. It is a portfolio project by Harsh
          Bathija: the bookings, accounts and availability are real records in a real database, but no car will turn up
          at your door.
        </p>

        <ul className="pillars">
          {PILLARS.map((p) => (
            <li key={p.title}>
              <span className="pillars__icon" aria-hidden="true">
                <ion-icon name={p.icon}></ion-icon>
              </span>
              <h2>{p.title}</h2>
              <p>{p.text}</p>
            </li>
          ))}
        </ul>

        <h2>Under the hood</h2>
        <dl className="stack-list">
          {STACK.map(([k, v]) => (
            <div key={k}>
              <dt>{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
        </dl>

        <div className="cta-row">
          <Link to="/cars" className="btn btn--primary">
            Browse the fleet
          </Link>
          <a href={REPO_URL} className="btn btn--ghost" target="_blank" rel="noreferrer">
            <ion-icon name="logo-github" aria-hidden="true"></ion-icon>
            View the source
          </a>
        </div>
      </div>
    </div>
  );
}
