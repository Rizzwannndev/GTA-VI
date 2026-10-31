import { useEffect } from "react";
import { ScrollTrigger } from "../animations/gsap";

// Recalculate every ScrollTrigger once fonts are ready and whenever an image
// finishes loading anywhere in the document (load events don't bubble, so we
// listen in the capture phase). Debounced so a gallery of images costs one
// refresh, not fifty.
export function useScrollRefresh() {
  useEffect(() => {
    let timer = 0;
    const schedule = () => {
      clearTimeout(timer);
      timer = setTimeout(() => ScrollTrigger.refresh(), 150);
    };
    const onLoad = (e) => {
      if (e.target instanceof HTMLImageElement) schedule();
    };
    document.addEventListener("load", onLoad, true);
    window.addEventListener("load", schedule);
    document.fonts?.ready.then(schedule);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("load", onLoad, true);
      window.removeEventListener("load", schedule);
    };
  }, []);
}
