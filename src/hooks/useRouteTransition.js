import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router";
import { ScrollTrigger } from "../animations/gsap";
import { stage } from "../animations/stage";
import { lockScroll, scrollToTop, unlockScroll } from "../animations/smooth";
import { coverScreen, revealScreen } from "../animations/transition";
import { findRoute } from "../data/routes";
import { uiSound } from "../audio/music";

const frame = () => new Promise((r) => requestAnimationFrame(() => r()));
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

// Returns the location the <Routes> should render. It lags the real location
// while the transition covers the screen, so the old page stays put until
// the panels are down, and the new one mounts underneath them. Links, the
// menu and back/forward all go through here. If the location changes again
// mid-transition, the loop simply carries on to the newest one.
export function useRouteTransition() {
  const location = useLocation();
  const [shown, setShown] = useState(location);
  const latest = useRef(location);
  const shownPath = useRef(location.pathname);
  const running = useRef(false);

  // Same page, different hash or query: no transition needed.
  if (location !== shown && location.pathname === shown.pathname) {
    setShown(location);
  }

  useEffect(() => {
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
  }, []);

  useEffect(() => {
    latest.current = location;
    if (running.current || location.pathname === shownPath.current) return;
    running.current = true;

    (async () => {
      lockScroll();
      let navigated = false;
      while (latest.current.pathname !== shownPath.current) {
        const route = findRoute(latest.current.pathname);
        uiSound("whoosh");
        await Promise.all([coverScreen(route.name), route.load?.().catch(() => {})]);

        const next = latest.current;
        stage.set({ revealed: false, covered: true });
        shownPath.current = next.pathname;
        setShown(next);
        scrollToTop();

        // Let React commit the new page (and its lazy chunk resolve), then
        // drop triggers whose elements went away with the old page.
        await wait(60);
        await frame();
        await frame();
        ScrollTrigger.getAll().forEach((t) => {
          if (t.trigger && !document.contains(t.trigger)) t.kill();
        });
        ScrollTrigger.refresh();

        stage.set({ revealed: true, covered: false });
        await revealScreen();
        navigated = true;
      }
      unlockScroll();
      running.current = false;
      if (navigated) document.getElementById("main")?.focus({ preventScroll: true });
    })();
  }, [location]);

  return shown;
}
