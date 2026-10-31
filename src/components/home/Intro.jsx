import { useRef } from "react";
import { gsap, useGSAP } from "../../animations/gsap";
import { bayUrl } from "../../assets/images/art";
import { ViGlyph } from "../svg/ViMark";

// The original opening: the bay seen through the letters VI, which tilt and
// then rush past the camera. The timeline is the original one, unchanged in
// values; it now hands off through `onDone` instead of removing DOM nodes.
export default function Intro({ onDone }) {
  const rootRef = useRef(null);
  const doneRef = useRef(false);

  useGSAP(
    () => {
      const finish = () => {
        if (doneRef.current) return;
        doneRef.current = true;
        onDone();
      };
      const tl = gsap.timeline();
      tl.to(".vi-mask-group", {
        rotate: 10,
        duration: 2,
        ease: "power4.inOut",
        transformOrigin: "50% 50%",
      }).to(".vi-mask-group", {
        scale: 10,
        duration: 2,
        delay: -1.8,
        ease: "expo.inOut",
        transformOrigin: "50% 50%",
        opacity: 0,
        onUpdate() {
          if (this.progress() >= 0.9) finish();
        },
      });
    },
    { scope: rootRef },
  );

  return (
    <div ref={rootRef} className="intro" aria-hidden="true">
      <svg viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice">
        <defs>
          <mask id="vi-mask">
            <rect width="100%" height="100%" fill="black" />
            <g className="vi-mask-group">
              <g transform="translate(274 205) scale(0.2568) translate(-148 -180)">
                <ViGlyph fill="white" />
              </g>
            </g>
          </mask>
        </defs>
        <image href={bayUrl} width="100%" height="100%" preserveAspectRatio="xMidYMid slice" mask="url(#vi-mask)" />
      </svg>
    </div>
  );
}
