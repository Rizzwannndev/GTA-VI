import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router";
import { useFocusTrap } from "../../hooks/useFocusTrap";
import Logo from "./Logo";
import MusicToggle from "./MusicToggle";
import Menu from "./Menu";

// Minimal fixed header: logo left; music toggle and menu button right. It
// slides away while you scroll down and comes back as soon as you scroll up,
// and picks up a dark backing once the page has moved off the hero.
export default function Header() {
  const headerRef = useRef(null);
  const toggleRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();
  const [prevPath, setPrevPath] = useState(pathname);

  // A route change (link, back/forward) always closes the menu.
  if (pathname !== prevPath) {
    setPrevPath(pathname);
    setOpen(false);
  }

  const close = useCallback(() => setOpen(false), []);
  useFocusTrap(headerRef, open, { onEscape: close, initialFocus: toggleRef });

  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 40);
      if (Math.abs(y - last) > 6) {
        setHidden(y > last && y > 240);
        last = y;
      }
    };
    // Lenis drives the real window scroll, so native scroll events fire.
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const cls = ["site-header", open && "is-open", hidden && !open && "is-hidden", scrolled && !open && "is-scrolled"].filter(Boolean).join(" ");

  return (
    <header ref={headerRef} className={cls}>
      <Menu open={open} onClose={close} />
      <div className="site-header__bar">
        <Logo onClick={close} />
        <div className="site-header__actions">
          <MusicToggle />
          <button
            ref={toggleRef}
            type="button"
            className={`menu-btn ${open ? "is-open" : ""}`}
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls={open ? "site-menu" : undefined}
            aria-label={open ? "Close menu" : "Open menu"}
            data-cursor="link"
          >
            <span className="menu-btn__label" aria-hidden="true">
              {open ? "Close" : "Menu"}
            </span>
            <span className="menu-btn__lines" aria-hidden="true">
              <span className="menu-btn__line" />
              <span className="menu-btn__line" />
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
