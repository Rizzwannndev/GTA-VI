import { Link } from "react-router";
import ViMark from "../svg/ViMark";

export default function Logo({ onClick }) {
  return (
    <Link to="/" className="logo" aria-label="Leonida Unofficial, home" onClick={onClick} data-cursor="link">
      <ViMark className="logo__mark" gradientId="vi-logo-grad" />
      <span className="logo__word">
        Leonida
        <span className="logo__sub">unofficial</span>
      </span>
    </Link>
  );
}
