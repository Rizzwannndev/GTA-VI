// The VI letterforms, traced from the geometry of the game logo (a slanted V
// whose right arm meets an upright I). Drawn as paths so the intro mask looks
// the same on every device instead of depending on an installed font.
export const VI_VIEWBOX = "140 172 993 756";
export const VI_V = "M148 180 L418 180 L505 360 L590 180 L855 180 L505 920 Z";
export const VI_I = "M870 180 L1125 180 L1125 920 L870 920 Z";

/** Bare <g> of the two letters, for use inside other SVGs (masks, loaders). */
export function ViGlyph({ fill = "currentColor", stroke, strokeWidth, className, pathClassName }) {
  return (
    <g className={className} fill={fill} stroke={stroke} strokeWidth={strokeWidth} strokeLinejoin="round">
      <path className={pathClassName} d={VI_V} />
      <path className={pathClassName} d={VI_I} />
    </g>
  );
}

/** Standalone mark with the logo's sunset gradient. */
export default function ViMark({ className, title, gradientId = "vi-mark-grad" }) {
  return (
    <svg className={className} viewBox={VI_VIEWBOX} role={title ? "img" : undefined} aria-hidden={title ? undefined : "true"}>
      {title && <title>{title}</title>}
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#4a6ee0" />
          <stop offset="0.38" stopColor="#8a4fd0" />
          <stop offset="0.68" stopColor="#ff4fa6" />
          <stop offset="1" stopColor="#ff9b4a" />
        </linearGradient>
      </defs>
      <ViGlyph fill={`url(#${gradientId})`} stroke="#5a0a5e" strokeWidth="18" />
    </svg>
  );
}
