# Leonida Unofficial: a Grand Theft Auto VI fan site

A fan-made guide to Grand Theft Auto VI, built as a motion-design practice project. It opens with a line-drawn VI preloader, then covers Rockstar's trailers, the characters, the state of Leonida, its vehicles and the November 19, 2026 launch.

Live: https://gta-vi-iota-one.vercel.app/

> Fan-made project, not affiliated with Rockstar Games. All trailers and trademarks belong to Rockstar Games.

## What's inside

- **Preloader and home.** The VI mark and two palms draw themselves while the site loads, then wipe up onto a pinned hero whose layers pull apart on scroll, a trailer feature, kinetic type, a horizontal scroll of the six regions, Jason and Lucia, live counters and a call to action.
- **Ten routes.** Home, Characters, Leonida (an interactive SVG map), Vehicles (a drag carousel), Gallery (a lightbox that opens with Flip), Trailers, News (animated filters), Editions, About/Contact (a validated form) and a "Wasted" 404.
- **Full-screen menu.** Panels wipe in and huge links rise from masks. Hovering a link dims the others, swaps it to an outline and fades in a preview. Esc closes the menu, focus is trapped and scroll is locked.
- **Page transitions.** One panel wipe with the destination name, used by links, the menu and the browser's back and forward buttons.
- **Text and SVG motion.** SplitText reveals, a scramble on key dates and labels, outlined lines that fill on scroll, map outlines and dividers that draw in, and a preloader whose VI mark and palms draw themselves. Marquees react to scroll speed.
- **Custom cursor.** A dot plus a trailing ring, with View, Play, Drag and Close labels and magnetic controls. It only runs for a mouse and is off under reduced motion.
- **Music.** Off by default. Turning it on keeps it playing across pages; it pauses when the tab is hidden and fades out while a trailer plays. See [Background music](#background-music).
- **Official trailers.** All six come from Rockstar's YouTube channel, embedded through `youtube-nocookie.com` behind a click-to-load facade.

Everything respects `prefers-reduced-motion`, works by keyboard and holds up from 320px phones to 2560px screens.

## Tech stack

- React 19 with Vite 7, and React Router with code-split routes
- GSAP 3 (ScrollTrigger, SplitText, DrawSVG, Flip, CustomEase, ScrambleText) with `@gsap/react`
- Lenis smooth scrolling, driven by the GSAP ticker
- Tailwind CSS 4, plus hand-written CSS in `src/styles`
- Archivo Variable (via Fontsource), using its width axis for display type
- The Web Audio API for the generative music and UI sounds

## Getting started

```bash
npm install
npm run dev       # local dev server
npm run lint      # ESLint
npm run build     # production build in dist/
npm run preview   # serve the build locally
```

It deploys to Vercel as-is. `vercel.json` rewrites every path to the SPA and caches hashed assets for a year.

## Project structure

```
src/
├── animations/   GSAP setup, motion helpers, Lenis, page transition, stage store, media bus
├── assets/
│   ├── images/   project artwork (hero bay, logo, character cut-outs), WebP/AVIF
│   └── photos/   official GTA VI screenshots, WebP/AVIF, credits in photos.js
├── audio/        music store, generative synthwave loop, UI sounds
├── components/
│   ├── home/     home page sections
│   ├── layout/   header, menu, footer, preloader, cursor, page hero, transition
│   ├── leonida/  SVG map
│   ├── svg/      VI mark, palm line art, divider
│   ├── ui/       button, picture, marquee, tilt card, icons
│   └── video/    trailer facade and modal
├── context/      video modal context
├── data/         routes, trailers, characters, locations, vehicles, gallery, news, editions
├── hooks/        focus trap, route transition, media queries, magnetic, scroll refresh
├── pages/        one file per route
└── styles/       tokens, base, components, home, pages
```

## Content and credits

- **Trailers:** official uploads on the Rockstar Games YouTube channel, listed in `src/data/trailers.js`. To add one, add an entry with its YouTube ID.
- **Screenshots:** official images from [rockstargames.com/VI/media/screenshots](https://www.rockstargames.com/VI/media/screenshots), credited to Rockstar Games wherever they appear.
- **Facts and names:** Rockstar's own pages and videos. Vehicle ratings are fan estimates.

## Background music

Music is off until the visitor turns it on with the equalizer button in the header.

- **Your own track:** save a track you have the rights to as `public/audio/leonida-nights.mp3`. It is picked up automatically and loops. Rockstar's soundtracks and trailer audio (including the GTA IV and GTA V themes) are copyrighted and are not shipped with this project.
- **Without a file:** the site plays "Leonida Drive", an original generative West Coast groove built in the browser with the Web Audio API (`src/audio/synth.js`): electric piano, sub bass, a whistle lead and a swung boom-bap kit. No third-party audio ships with the project.
- The choice is saved in `localStorage`. Music pauses while the tab is hidden and fades out while a trailer plays.
- The optional UI sounds (hover ticks, clicks, the wipe whoosh) only play while the music is on.

## License

The code is open source. Grand Theft Auto VI, its trailers, screenshots and trademarks belong to Rockstar Games.
