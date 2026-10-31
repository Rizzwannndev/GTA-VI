import { useRef } from "react";
import { Link } from "react-router";
import { useMagnetic } from "../../hooks/useMagnetic";
import Icon from "./Icon";

// One button for the whole site. Renders a router <Link> for `to`, an <a>
// for external `href` (always new tab, announced), or a <button>.
// Primary buttons get the magnetic pull on desktop.
export default function Button({
  to,
  href,
  onClick,
  variant = "primary",
  icon,
  children,
  className = "",
  magnetic = variant === "primary",
  type = "button",
  ...rest
}) {
  const ref = useRef(null);
  useMagnetic(ref, { enabled: magnetic });

  const cls = `btn btn--${variant} ${className}`;
  const body = (
    <>
      <span className="btn__fill" aria-hidden="true" />
      <span className="btn__label">
        {children}
        {icon && <Icon name={icon} size="1.1em" className="btn__icon" />}
      </span>
    </>
  );

  if (to) {
    return (
      <Link ref={ref} to={to} className={cls} data-cursor="link" {...rest}>
        {body}
      </Link>
    );
  }
  if (href) {
    return (
      <a ref={ref} href={href} target="_blank" rel="noreferrer" className={cls} data-cursor="link" {...rest}>
        {body}
        <span className="sr-only"> (opens in a new tab)</span>
      </a>
    );
  }
  return (
    <button ref={ref} type={type} onClick={onClick} className={cls} data-cursor="link" {...rest}>
      {body}
    </button>
  );
}
