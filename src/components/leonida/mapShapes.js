// Hand-drawn fan map of Leonida (not to scale, not official). Regions share
// borders so the state reads as one landmass. viewBox: 0 0 800 900.
export const MAP_VIEWBOX = "0 0 800 900";

export const COAST =
  "M40 80 L300 74 L470 70 L560 110 L640 120 L680 150 L690 230 L700 260 L715 360 L740 500 L750 600 L730 690 L690 740 L640 760 L600 730 L560 640 L520 560 L470 470 L430 380 L420 300 L380 230 L330 190 L250 175 L150 185 L60 170 L40 120 Z";

export const regionShapes = {
  "port-gellhorn": { d: "M40 80 L300 74 L330 190 L250 175 L150 185 L60 170 L40 120 Z", label: [180, 132] },
  "mount-kalaga": {
    d: "M300 74 L470 70 L560 110 L640 120 L680 150 L690 230 L560 250 L420 300 L380 230 L330 190 Z",
    label: [500, 168],
  },
  ambrosia: { d: "M420 300 L560 250 L690 230 L700 260 L715 360 L640 400 L560 420 L470 470 L430 380 Z", label: [570, 335] },
  grassrivers: { d: "M470 470 L560 420 L640 400 L650 560 L640 700 L600 730 L560 640 L520 560 Z", label: [560, 600] },
  "vice-city": {
    d: "M640 400 L715 360 L740 500 L750 600 L730 690 L690 740 L640 760 L600 730 L640 700 L650 560 Z",
    label: [700, 520],
    city: [722, 590],
  },
  "leonida-keys": {
    d: "M612 790 a26 11 -12 1 0 1 0 Z M566 812 a24 10 -10 1 0 1 0 Z M520 830 a22 9 -8 1 0 1 0 Z M474 844 a20 9 -5 1 0 1 0 Z M428 852 a18 8 -2 1 0 1 0 Z M384 856 a16 7 0 1 0 1 0 Z",
    hit: "M640 786 Q520 840 370 858",
    label: [500, 880],
  },
};
