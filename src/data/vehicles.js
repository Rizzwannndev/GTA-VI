// Fan garage. These are vehicle *types* seen across the official trailers,
// not confirmed in-game models, and the ratings are fan estimates out of 10.
// Photos are real-world stand-ins, credited from photos.js.
import { photos } from "../assets/photos/photos";

export const vehicles = [
  { id: "muscle-car", name: "Muscle car", type: "Land", photo: photos["muscle-car"], art: photos["muscle-car"].src, ratings: { speed: 7, handling: 5, style: 10 }, note: "Big engine, loud paint, terrible brakes. The getaway car of choice." },
  { id: "sports-coupe", name: "Sports coupe", type: "Land", photo: photos["sports-coupe"], art: photos["sports-coupe"].src, ratings: { speed: 9, handling: 8, style: 8 }, note: "Low, wide and fast on the causeways between Vice City and the beach." },
  { id: "street-bike", name: "Street bike", type: "Land", photo: photos["street-bike"], art: photos["street-bike"].src, ratings: { speed: 9, handling: 7, style: 7 }, note: "Splits traffic on the ocean drive. Not forgiving on gravel." },
  { id: "airboat", name: "Airboat", type: "Water", photo: photos["airboat"], art: photos["airboat"].src, ratings: { speed: 6, handling: 6, style: 8 }, note: "The only sensible way through Grassrivers. Bring ear protection." },
  { id: "speedboat", name: "Speedboat", type: "Water", photo: photos["speedboat"], art: photos["speedboat"].src, ratings: { speed: 8, handling: 7, style: 9 }, note: "Out past the Keys before anyone on shore knows you left." },
  { id: "police-cruiser", name: "Police cruiser", type: "Land", photo: photos["police-cruiser"], art: photos["police-cruiser"].src, ratings: { speed: 7, handling: 7, style: 5 }, note: "You'll see more of these in your mirrors than you'd like." },
  { id: "helicopter", name: "Helicopter", type: "Air", photo: photos["helicopter"], art: photos["helicopter"].src, ratings: { speed: 8, handling: 5, style: 7 }, note: "News crews, police and the very rich. Great view of the bay." },
  { id: "swamp-truck", name: "Lifted pickup", type: "Land", photo: photos["swamp-truck"], art: photos["swamp-truck"].src, ratings: { speed: 5, handling: 4, style: 7 }, note: "Mud tyres and a light bar. At home on the back roads to Ambrosia." },
];

export const RATING_LABELS = { speed: "Speed", handling: "Handling", style: "Style" };
