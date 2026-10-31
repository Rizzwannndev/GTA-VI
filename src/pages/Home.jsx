import { useStage } from "../animations/stage";
import PageMeta from "../components/layout/PageMeta";
import Hero from "../components/home/Hero";
import Welcome from "../components/home/Welcome";
import TrailerFeature from "../components/home/TrailerFeature";
import StillRunning from "../components/home/StillRunning";
import Locations from "../components/home/Locations";
import Duo from "../components/home/Duo";
import Stats from "../components/home/Stats";
import Cta from "../components/home/Cta";

// The preloader is the one opening animation; when it wipes away, the hero
// plays its settle straight away.
export default function Home() {
  const { revealed } = useStage();

  return (
    <>
      <PageMeta route="home" />
      <Hero ready={revealed} />
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
