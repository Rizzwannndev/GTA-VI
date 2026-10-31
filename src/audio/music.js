// Background music. Off by default; the first click on the header toggle
// starts it with a fade-in, and the choice is remembered in localStorage.
//
// Source: if public/audio/leonida-nights.mp3 exists, that file plays on a
// loop. Drop any royalty-free synthwave track there (same file name) to use
// it. Without the file, a small generative synthwave loop is synthesised in
// the browser with the Web Audio API, so the toggle always works and no
// copyrighted audio ships with the site.
import { useSyncExternalStore } from "react";
import { mediaBus } from "../animations/mediaBus";
import { startSynth } from "./synth";

export const TRACK_URL = "/audio/leonida-nights.mp3";
const STORAGE_KEY = "leonida:music";
const VOLUME = 0.55;
const FADE_IN = 2.2;
const FADE_OUT = 0.8;

let state = { on: false, playing: false, track: "Leonida Nights" };
const listeners = new Set();
const set = (patch) => {
  state = { ...state, ...patch };
  listeners.forEach((l) => l());
};

let ctx = null;
let master = null;
let source = null; // { stop() }
let ducked = false;
let hidden = false;

const readPref = () => {
  try {
    return localStorage.getItem(STORAGE_KEY) === "on";
  } catch {
    return false;
  }
};
const writePref = (value) => {
  try {
    localStorage.setItem(STORAGE_KEY, value ? "on" : "off");
  } catch {
    /* storage blocked: the choice just won't persist */
  }
};

async function fileSource() {
  const res = await fetch(TRACK_URL, { method: "HEAD" });
  const type = res.headers.get("content-type") ?? "";
  if (!res.ok || !type.startsWith("audio")) throw new Error("no track file");
  const el = new Audio(TRACK_URL);
  el.loop = true;
  el.crossOrigin = "anonymous";
  const node = ctx.createMediaElementSource(el);
  node.connect(master);
  await el.play();
  return { stop: () => el.pause(), pause: () => el.pause(), resume: () => el.play(), label: "Your track" };
}

async function ensureSource() {
  if (source) return;
  const Ctx = window.AudioContext || window.webkitAudioContext;
  if (!Ctx) throw new Error("Web Audio unavailable");
  ctx = ctx ?? new Ctx();
  if (!master) {
    master = ctx.createGain();
    master.gain.value = 0;
    master.connect(ctx.destination);
  }
  await ctx.resume();
  try {
    source = await fileSource();
  } catch {
    source = startSynth(ctx, master);
  }
  set({ track: source.label });
}

function rampTo(value, seconds) {
  if (!ctx || !master) return;
  const now = ctx.currentTime;
  master.gain.cancelScheduledValues(now);
  master.gain.setValueAtTime(master.gain.value, now);
  master.gain.linearRampToValueAtTime(value, now + seconds);
}

const audible = () => state.on && !ducked && !hidden;

function applyLevel() {
  if (!ctx) return;
  if (audible()) {
    ctx.resume();
    source?.resume?.();
    rampTo(VOLUME, FADE_IN);
    set({ playing: true });
  } else {
    rampTo(0, FADE_OUT);
    set({ playing: false });
    // Once silent, stop scheduling notes so a muted tab costs nothing.
    setTimeout(() => {
      if (!audible()) source?.pause?.();
    }, FADE_OUT * 1000 + 50);
  }
}

export async function setMusic(onValue) {
  writePref(onValue);
  set({ on: onValue });
  if (onValue) {
    try {
      await ensureSource();
    } catch {
      set({ on: false, playing: false });
      return;
    }
  }
  applyLevel();
}

export const toggleMusic = () => setMusic(!state.on);

export const music = {
  get: () => state,
  subscribe: (fn) => {
    listeners.add(fn);
    return () => listeners.delete(fn);
  },
};

export function useMusic() {
  return useSyncExternalStore(music.subscribe, music.get, music.get);
}

// One-time wiring: tab visibility, trailer ducking, and resuming a saved
// "on" preference at the first user gesture (autoplay rules forbid more).
let wired = false;
export function initMusic() {
  if (wired) return () => {};
  wired = true;
  const onVisibility = () => {
    hidden = document.hidden;
    applyLevel();
  };
  document.addEventListener("visibilitychange", onVisibility);
  const offStart = mediaBus.on("video:start", () => {
    ducked = true;
    applyLevel();
  });
  const offStop = mediaBus.on("video:stop", () => {
    ducked = false;
    applyLevel();
  });
  let offGesture = () => {};
  if (readPref()) {
    const resume = (e) => {
      if (e.target.closest?.("[data-music-toggle]")) return;
      offGesture();
      setMusic(true);
    };
    window.addEventListener("pointerdown", resume, { once: false });
    window.addEventListener("keydown", resume, { once: false });
    offGesture = () => {
      window.removeEventListener("pointerdown", resume);
      window.removeEventListener("keydown", resume);
    };
  }
  return () => {
    wired = false;
    document.removeEventListener("visibilitychange", onVisibility);
    offStart();
    offStop();
    offGesture();
  };
}
