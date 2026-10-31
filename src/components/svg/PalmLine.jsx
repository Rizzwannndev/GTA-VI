// A single-stroke palm tree for DrawSVG line-drawing. Every path is a stroke
// (no fills) so drawSVG can animate it from 0% to 100%.
export default function PalmLine({ className, flip = false }) {
  return (
    <svg
      className={className}
      viewBox="0 0 220 320"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      style={flip ? { transform: "scaleX(-1)" } : undefined}
    >
      <path className="palm-trunk" d="M118 318 C112 262 104 206 116 122" />
      <path className="palm-trunk" d="M110 296 l12 -3 M108 270 l12 -3 M107 244 l12 -3 M108 218 l12 -3 M110 192 l11 -3 M112 166 l11 -3 M114 142 l10 -2" />
      <path className="palm-frond" d="M116 122 Q72 92 18 112" />
      <path className="palm-frond" d="M116 122 Q78 66 34 54" />
      <path className="palm-frond" d="M116 122 Q112 58 88 16" />
      <path className="palm-frond" d="M116 122 Q142 58 178 34" />
      <path className="palm-frond" d="M116 122 Q166 92 210 110" />
      <path className="palm-frond" d="M116 122 Q156 132 182 176" />
      <path className="palm-frond" d="M116 122 Q76 132 50 170" />
      <path className="palm-leaf" d="M40 104 l-8 14 M58 98 l-6 16 M76 100 l-4 15 M48 60 l2 16 M64 66 l0 16 M82 76 l-2 15 M98 34 l-12 8 M104 52 l-12 8 M150 50 l8 14 M164 42 l10 12 M136 66 l6 14 M150 96 l6 16 M170 100 l8 16 M188 104 l8 14 M140 138 l-12 8 M156 150 l-10 10 M90 136 l12 8 M72 148 l12 10" />
    </svg>
  );
}
