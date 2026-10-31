import { useRef } from "react";
import { Link } from "react-router";
import { useGSAP } from "../../animations/gsap";
import { revealText } from "../../animations/motion";
import { scrollToTarget } from "../../animations/smooth";
import { AUTHOR, DISCLAIMER, OFFICIAL_URL, SITE_NAME, socials } from "../../data/site";
import { navRoutes } from "../../data/routes";
import Marquee from "../ui/Marquee";
import Icon from "../ui/Icon";
import ViMark from "../svg/ViMark";

export default function Footer() {
  const rootRef = useRef(null);

  useGSAP(
    () => {
      revealText(".footer__disclaimer", { start: "top 95%" });
    },
    { scope: rootRef },
  );

  return (
    <footer ref={rootRef} className="footer" aria-labelledby="footer-title">
      <h2 id="footer-title" className="sr-only">
        Site footer
      </h2>
      <Marquee className="footer__marquee" speed={70} label="Only in Leonida">
        <span className="footer__mega">Only in Leonida</span>
        <ViMark className="footer__mark" gradientId="vi-footer-grad" />
      </Marquee>

      <div className="wrap footer__grid">
        <nav className="footer__col" aria-label="Footer">
          <h3 className="footer__heading">Explore</h3>
          <ul className="footer__links">
            {navRoutes.map((r) => (
              <li key={r.path}>
                <Link to={r.path}>{r.name}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="footer__col">
          <h3 className="footer__heading">Rockstar Games, officially</h3>
          <ul className="footer__social">
            {socials.map((s) => (
              <li key={s.id}>
                <a href={s.href} target="_blank" rel="noreferrer" aria-label={`${s.label} (opens in a new tab)`} data-cursor="link">
                  <Icon name={s.id} size="1.25rem" />
                  <span>{s.short}</span>
                </a>
              </li>
            ))}
            <li>
              <a href={OFFICIAL_URL} target="_blank" rel="noreferrer" data-cursor="link">
                <Icon name="external" size="1.25rem" />
                <span>rockstargames.com/VI</span>
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </li>
          </ul>
        </div>

        <div className="footer__col footer__col--wide">
          <p className="footer__disclaimer">{DISCLAIMER}</p>
          <p className="footer__credit">
            {SITE_NAME}. Designed and built by{" "}
            <a href={AUTHOR.url} target="_blank" rel="noreferrer">
              {AUTHOR.name}
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
            , {new Date().getFullYear()}.
          </p>
          <button type="button" className="footer__top" onClick={() => scrollToTarget(0)} data-cursor="link">
            <Icon name="arrowDown" size="1.1rem" className="footer__top-icon" />
            Back to top
          </button>
        </div>
      </div>
    </footer>
  );
}
