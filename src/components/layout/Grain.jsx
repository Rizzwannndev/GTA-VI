// Fixed film-grain layer. Pure CSS (see .grain in styles/base.css); the
// animation stops under prefers-reduced-motion.
export default function Grain() {
  return <div className="grain" aria-hidden="true" />;
}
