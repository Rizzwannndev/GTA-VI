// A tiny external store for the "stage": whether the current page is visible
// yet (the preloader and page transitions hold it back), and whether a
// transition panel is covering it.
import { useSyncExternalStore } from "react";

let state = {
  revealed: false,
  covered: false,
};
const listeners = new Set();

export const stage = {
  get: () => state,
  set(partial) {
    state = { ...state, ...partial };
    listeners.forEach((fn) => fn());
  },
  subscribe(fn) {
    listeners.add(fn);
    return () => listeners.delete(fn);
  },
};

export function useStage() {
  return useSyncExternalStore(stage.subscribe, stage.get, stage.get);
}

/** True once the page is on screen; page entrance animations key off this. */
export function usePageRevealed() {
  return useStage().revealed;
}
