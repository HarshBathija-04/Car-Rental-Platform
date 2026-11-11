import { useEffect, useState } from 'react';
import { onSlowChange } from '../lib/api.js';

export default function WakeBanner() {
  const [slow, setSlow] = useState(false);
  useEffect(() => onSlowChange(setSlow), []);
  if (!slow) return null;
  return (
    <div className="wake-banner" role="status">
      <span className="spinner" aria-hidden="true"></span>
      <p>
        <strong>Waking up the server.</strong> The free-tier API sleeps when idle, so the first request can take up to a
        minute. Hang tight.
      </p>
    </div>
  );
}
