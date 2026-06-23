import { Link } from 'react-router-dom';

export default function Button({
  children,
  to,
  type = 'button',
  variant = 'primary',
  size = 'default',
  className = '',
  ...props
}) {
  const classes = `button button-${variant} button-size-${size} ${className}`.trim();

  if (to) {
    return (
      <Link to={to} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} className={classes} {...props}>
      {children}
    </button>
  );
}