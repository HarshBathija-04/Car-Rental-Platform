/** Labelled input with hint and inline error wired up through aria-describedby. */
export default function Field({ id, label, hint, error, as = 'input', className = '', children, ...props }) {
  const Tag = as;
  const describedBy = [hint && `${id}-hint`, error && `${id}-error`].filter(Boolean).join(' ') || undefined;
  return (
    <div className={`field ${error ? 'field--invalid' : ''} ${className}`}>
      <label htmlFor={id} className="field__label">
        {label}
      </label>
      <Tag
        id={id}
        name={id}
        className="field__control"
        aria-invalid={Boolean(error)}
        aria-describedby={describedBy}
        {...props}
      >
        {children}
      </Tag>
      {hint && !error && (
        <p id={`${id}-hint`} className="field__hint">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="field__error">
          {error}
        </p>
      )}
    </div>
  );
}
