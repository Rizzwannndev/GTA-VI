// Fan garage, pictured with Rockstar's official screenshots. Model names
// come from those screenshots (the Ultimate Edition and Vice City Pack
// pages); the rest are vehicle types seen in the trailers. Ratings are fan
// estimates out of 10, not game stats.
import { photos } from "../assets/photos/photos";

export const vehicles = [
  { id: "muscle-car", name: "Vapid Ganado", type: "Land", photo: photos["muscle-car"], art: photos["muscle-car"].src, ratings: { speed: 7, handling: 5, style: 10 }, note: "A retro build with a hood scoop and racing stripes. Comes with the Ultimate Edition." },
  { id: "sports-coupe", name: "Grotti Cheetah", type: "Land", photo: photos["sports-coupe"], art: photos["sports-coupe"].src, ratings: { speed: 9, handling: 8, style: 8 }, note: "Pop-up headlights and a white wedge body. Another Ultimate Edition car." },
  { id: "street-bike", name: "Dirt bike", type: "Land", photo: photos["street-bike"], art: photos["street-bike"].src, ratings: { speed: 9, handling: 7, style: 7 }, note: "Parked at the safehouse. Light enough for the trails up around Mount Kalaga." },
  { id: "airboat", name: "Airboat", type: "Water", photo: photos["airboat"], art: photos["airboat"].src, ratings: { speed: 6, handling: 6, style: 8 }, note: "The only sensible way through Grassrivers. Bring ear protection." },
  { id: "speedboat", name: "Squalo", type: "Water", photo: photos["speedboat"], art: photos["speedboat"].src, ratings: { speed: 8, handling: 7, style: 9 }, note: "A sport boat made for night runs past Vice City's skyline." },
  { id: "police-cruiser", name: "Police cruiser", type: "Land", photo: photos["police-cruiser"], art: photos["police-cruiser"].src, ratings: { speed: 7, handling: 7, style: 5 }, note: "You'll see more of these in your mirrors than you'd like." },
  { id: "helicopter", name: "Helicopter", type: "Air", photo: photos["helicopter"], art: photos["helicopter"].src, ratings: { speed: 8, handling: 5, style: 7 }, note: "News crews, tour flights and the very rich, low over the hills." },
  { id: "swamp-truck", name: "Vapid Buggy", type: "Land", photo: photos["swamp-truck"], art: photos["swamp-truck"].src, ratings: { speed: 5, handling: 4, style: 7 }, note: "A lifted, mud-caked off-roader with a light bar. At home on the back roads." },
];

export const RATING_LABELS = { speed: "Speed", handling: "Handling", style: "Style" };
