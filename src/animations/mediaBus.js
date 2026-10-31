// A tiny event bus between video players and the background music, so a
// trailer starting can duck the music and closing it can bring it back.
const target = new EventTarget();

export const mediaBus = {
  videoStarted: () => target.dispatchEvent(new Event("video:start")),
  videoStopped: () => target.dispatchEvent(new Event("video:stop")),
  on(type, fn) {
    target.addEventListener(type, fn);
    return () => target.removeEventListener(type, fn);
  },
};
