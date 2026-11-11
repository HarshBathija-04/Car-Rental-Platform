export function EmptyState({ icon = 'car-outline', title, children, action, headingLevel = 2 }) {
  const Heading = headingLevel === 1 ? 'h1' : 'h2';
  return (
    <div className="state">
      <span className="state__icon" aria-hidden="true">
        <ion-icon name={icon}></ion-icon>
      </span>
      <Heading className="state__title">{title}</Heading>
      {children && <p className="state__text">{children}</p>}
      {action}
    </div>
  );
}

export function ErrorState({ error, onRetry }) {
  return (
    <div className="state state--error" role="alert">
      <span className="state__icon" aria-hidden="true">
        <ion-icon name="cloud-offline-outline"></ion-icon>
      </span>
      <h2 className="state__title">We hit a bump</h2>
      <p className="state__text">{error?.message || 'Something went wrong.'}</p>
      {onRetry && (
        <button type="button" className="btn btn--primary" onClick={onRetry}>
          Try again
        </button>
      )}
    </div>
  );
}

export function Spinner({ label = 'Loading' }) {
  return (
    <span className="spinner" role="status" aria-label={label}>
      <span className="sr-only">{label}</span>
    </span>
  );
}
