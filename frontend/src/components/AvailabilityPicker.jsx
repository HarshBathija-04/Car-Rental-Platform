import { addDays, formatDate, isDayBooked, isRangeFree, MAX_RENTAL_DAYS, weekday } from '../lib/dates.js';

const WINDOW_DAYS = 28;

/**
 * Four-week calendar strip. First click picks the pick-up day, second click the
 * return day. A booked day can still be a return day when the rental before it is free.
 */
export default function AvailabilityPicker({ today, booked, start, end, onChange }) {
  const days = Array.from({ length: WINDOW_DAYS }, (_, i) => addDays(today, i));
  const choosingReturn = Boolean(start) && !end;

  const isValidReturn = (day) =>
    choosingReturn && day > start && day <= addDays(start, MAX_RENTAL_DAYS) && isRangeFree(start, day, booked);

  const pick = (day) => {
    if (isValidReturn(day)) onChange({ start, end: day });
    else onChange({ start: day, end: '' });
  };

  return (
    <div className="picker">
      <div className="picker__head">
        <p className="picker__title">Next 4 weeks</p>
        <p className="picker__prompt" aria-live="polite">
          {choosingReturn ? 'Now pick your return day' : 'Tap a free day to set pick-up'}
        </p>
      </div>
      <ul className="picker__grid">
        {days.map((day) => {
          const taken = isDayBooked(day, booked);
          const disabled = taken && !isValidReturn(day);
          const inRange = start && end && day >= start && day < end;
          const role = day === start ? 'Pick-up' : day === end ? 'Return' : null;
          const cls = [
            'picker__day',
            taken && 'is-booked',
            inRange && 'is-range',
            day === start && 'is-start',
            day === end && 'is-end',
          ]
            .filter(Boolean)
            .join(' ');
          return (
            <li key={day}>
              <button
                type="button"
                className={cls}
                disabled={disabled}
                aria-pressed={Boolean(inRange || role)}
                aria-label={`${formatDate(day, { weekday: 'long', day: 'numeric', month: 'long' })}, ${
                  taken ? 'booked' : 'available'
                }${role ? `, ${role.toLowerCase()} day` : ''}`}
                onClick={() => pick(day)}
              >
                <span className="picker__dow">{weekday(day)}</span>
                <span className="picker__num">{Number(day.slice(8))}</span>
              </button>
            </li>
          );
        })}
      </ul>
      <ul className="picker__legend" aria-hidden="true">
        <li>
          <span className="swatch swatch--free"></span>Free
        </li>
        <li>
          <span className="swatch swatch--booked"></span>Booked
        </li>
        <li>
          <span className="swatch swatch--range"></span>Your trip
        </li>
      </ul>
    </div>
  );
}
