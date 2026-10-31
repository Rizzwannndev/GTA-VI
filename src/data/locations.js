// The six regions Rockstar names on rockstargames.com/VI. Region names are
// official; the `note` text is our own fan write-up from the trailers and
// the official page, not Rockstar copy. `art` files are placeholders.
import viceCity from "../assets/placeholders/location-vice-city.svg";
import keys from "../assets/placeholders/location-leonida-keys.svg";
import grassrivers from "../assets/placeholders/location-grassrivers.svg";
import portGellhorn from "../assets/placeholders/location-port-gellhorn.svg";
import ambrosia from "../assets/placeholders/location-ambrosia.svg";
import kalaga from "../assets/placeholders/location-mount-kalaga.svg";

export const locations = [
  {
    id: "vice-city",
    name: "Vice City",
    short: "Vice City",
    art: viceCity,
    tone: "#ff3d8b",
    kicker: "The sun and fun capital of America",
    note: "Neon, high-rises and a beach that never empties. The city has changed since the '80s; the hustle hasn't.",
    known: ["Ocean-front strip", "Downtown towers", "Nightlife run by Boobie Ike"],
  },
  {
    id: "leonida-keys",
    name: "Leonida Keys",
    short: "The Keys",
    art: keys,
    tone: "#30e3d0",
    kicker: "Islands strung on one long bridge",
    note: "Turquoise shallows, boat yards and bars at the end of the road. Jason works for drug runners down here.",
    known: ["Brian Heder's boat yard", "Overseas bridges", "Sandbar parties"],
  },
  {
    id: "grassrivers",
    name: "Grassrivers",
    short: "Grassrivers",
    art: grassrivers,
    tone: "#7fd3a0",
    kicker: "Sawgrass, airboats and things in the water",
    note: "Leonida's wetlands: a slow, wide river of grass where the roads give out and the airboats take over.",
    known: ["Airboat runs", "Gator country", "Off-grid hideouts"],
  },
  {
    id: "port-gellhorn",
    name: "Port Gellhorn",
    short: "Port Gellhorn",
    art: portGellhorn,
    tone: "#ff8b3d",
    kicker: "A port town past its best years",
    note: "Cranes, container stacks and motels with the vacancy sign always lit. Raul Bautista's corner of the map.",
    known: ["Container docks", "Roadside motels", "Back-room grow ops"],
  },
  {
    id: "ambrosia",
    name: "Ambrosia",
    short: "Ambrosia",
    art: ambrosia,
    tone: "#ffcf7a",
    kicker: "Smokestacks over flat farmland",
    note: "An inland industrial town of refineries and long straight roads, where bikers and car-wash fundraisers share the same main street.",
    known: ["Refinery district", "Biker hangouts", "Endless straightaways"],
  },
  {
    id: "mount-kalaga",
    name: "Mount Kalaga",
    short: "Kalaga",
    art: kalaga,
    tone: "#a98bff",
    kicker: "A national park in the north",
    note: "Pine ridges, trails and hunting country around Mount Kalaga National Park. The quietest place in Leonida, for now.",
    known: ["National park trails", "Ridge lookouts", "Hunting grounds"],
  },
];
