import { useRef } from "react";
import { useGSAP } from "../../animations/gsap";
import { parallax, revealImage, revealText } from "../../animations/motion";
import { art } from "../../assets/images/art";
import { featuredTrailer } from "../../data/trailers";
import { OFFICIAL_URL, RELEASE_LABEL } from "../../data/site";
import { useVideo } from "../../context/VideoContext";
import Picture from "../ui/Picture";
import Button from "../ui/Button";
import PlatformMarks from "../ui/PlatformMarks";

// The original second section, reworked: same headline and copy, a Vice City
// image in place of the unrelated illustration, and accurate platform info in
// place of the Steam row.
export default function StillRunning() {
  const rootRef = useRef(null);
  const { openVideo } = useVideo();

  useGSAP(
    () => {
      revealImage(".still__frame", { from: "left" });
      parallax(".still__frame img", { speed: 6 });
      revealText(".still__title", { stagger: 0.12 });
      revealText(".still__copy p", { delay: 0.1 });
    },
    { scope: rootRef },
  );

  return (
    <section ref={rootRef} className="still section" aria-labelledby="still-title">
      <div className="wrap still__grid">
        <div className="still__frame" data-cursor="view">
          <Picture
            image={art.boobie}
            alt="Boobie Ike on the hood of an SUV outside the Jack of Hearts club, phone in hand"
            sizes="(max-width: 900px) 92vw, 46vw"
          />
        </div>
        <div className="still__copy">
          <h2 id="still-title" className="still__title">
            Still running,
            <br />
            not hunting
          </h2>
          <PlatformMarks className="still__platforms" />
          <p className="still__date">Out {RELEASE_LABEL}</p>
          <p>
            Grand Theft Auto VI takes players back to the neon-soaked streets of Vice City, delivering Rockstar's most
            immersive open-world experience yet.
          </p>
          <p>Step into a gripping crime story filled with fast cars, underground deals, and unpredictable encounters.</p>
          <p>
            Dive into a pulse-pounding crime saga packed with daring heists, roaring engines, shadowy alliances, and twists
            that strike when you least expect them.
          </p>
          <div className="still__actions">
            <Button href={OFFICIAL_URL} icon="arrowUpRight">
              Pre-order now
            </Button>
            <Button variant="ghost" icon="play" magnetic={false} onClick={(e) => openVideo(featuredTrailer, e.currentTarget)}>
              Watch the trailer
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
