import { useEffect } from "react";
import { magnetic } from "../animations/motion";

// Attaches the magnetic pull to a ref'd element (desktop pointers only).
export function useMagnetic(ref, { strength = 0.3, text = ".btn__label", enabled = true } = {}) {
  useEffect(() => {
    if (!enabled || !ref.current) return;
    return magnetic(ref.current, { strength, text });
  }, [ref, strength, text, enabled]);
}
