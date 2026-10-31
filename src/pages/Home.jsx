import { useEffect, useState } from "react";
import { stage, useStage } from "../animations/stage";
import { lockScroll, unlockScroll } from "../animations/smooth";
import PageMeta from "../components/layout/PageMeta";
import Intro from "../components/home/Intro";
import Hero from "../components/home/Hero";
import Welcome from "../components/home/Welcome";
import TrailerFeature from "../components/home/TrailerFeature";
import StillRunning from "../components/home/StillRunning";
import Locations from "../components/home/Locations";
import Duo from "../components/home/Duo";
import Stats from "../components/home/Stats";
import Cta from "../components/home/Cta";

export default function Home() {
  const { revealed } = useStage();
  // The VI intro plays only when the session starts on the home page.
  const [playIntro] = useState(() => stage.get().firstReveal);
  const [introDone, setIntroDone] = useState(!playIntro);

  useEffect(() => {
    if (!playIntro || introDone) return;
    lockScroll();
    return () => unlockScroll();
  }, [playIntro, introDone]);

  const finishIntro = () => {
    setIntroDone(true);
    stage.set({ firstReveal: false });
  };

  return (
    <>
      <PageMeta route="home" />
      {/* A stable host: the hero below gets wrapped in a pin-spacer on mount,
          so React must never need to insert a new sibling before it. */}
      {playIntro && !introDone && (
        <div className="intro-host">
          {revealed ? <Intro onDone={finishIntro} /> : <div className="intro" aria-hidden="true" />}
        </div>
      )}
      <Hero ready={revealed && introDone} />
      <Welcome />
      <TrailerFeature />
      <StillRunning />
      <Locations />
      <Duo />
      <Stats />
      <Cta />
    </>
  );
}
