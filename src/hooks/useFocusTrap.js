import { useEffect, useRef } from "react";

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), iframe, [tabindex]:not([tabindex="-1"])';

// Keeps Tab / Shift+Tab inside `ref` while `active`, closes on Escape, and
// hands focus back to whatever was focused before when it deactivates.
export function useFocusTrap(ref, active, { onEscape, initialFocus } = {}) {
  // Latest Esc handler without re-running the trap (which would steal focus)
  // every time the caller passes a fresh function.
  const escRef = useRef(onEscape);
  useEffect(() => {
    escRef.current = onEscape;
  });

  useEffect(() => {
    if (!active || !ref.current) return;
    const root = ref.current;
    const previous = document.activeElement;

    const focusables = () =>
      [...root.querySelectorAll(FOCUSABLE)].filter((el) => el.offsetParent !== null || el === document.activeElement);

    const first = initialFocus?.current ?? focusables()[0];
    first?.focus({ preventScroll: true });

    const onKey = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        escRef.current?.();
        return;
      }
      if (e.key !== "Tab") return;
      const items = focusables();
      if (!items.length) return;
      const head = items[0];
      const tail = items[items.length - 1];
      if (e.shiftKey && document.activeElement === head) {
        e.preventDefault();
        tail.focus();
      } else if (!e.shiftKey && document.activeElement === tail) {
        e.preventDefault();
        head.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      if (previous instanceof HTMLElement) previous.focus({ preventScroll: true });
    };
  }, [active, ref, initialFocus]);
}
