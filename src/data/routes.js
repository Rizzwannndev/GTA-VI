// Every route in one list: path, the name shown in menus and in the page
// transition, its <title>/meta description, the menu preview image, and a
// lazy loader (also used to preload the page during the transition).
import { lazy } from "react";
import { art } from "../assets/images/art";
import { photos } from "../assets/photos/photos";

const leonidaPreview = photos["vice-beach"].small;
const vehiclesPreview = photos["speedboat"].small;
const editionsPreview = photos["sports-coupe"].small;

const yt = (id) => `https://i.ytimg.com/vi/${id}/mqdefault.jpg`;

const loaders = {
  home: () => import("../pages/Home.jsx"),
  characters: () => import("../pages/Characters.jsx"),
  leonida: () => import("../pages/Leonida.jsx"),
  vehicles: () => import("../pages/Vehicles.jsx"),
  gallery: () => import("../pages/Gallery.jsx"),
  trailers: () => import("../pages/Trailers.jsx"),
  news: () => import("../pages/News.jsx"),
  editions: () => import("../pages/Editions.jsx"),
  about: () => import("../pages/About.jsx"),
  notFound: () => import("../pages/NotFound.jsx"),
};

const route = (key, path, name, title, description, preview) => ({
  key,
  path,
  name,
  title,
  description,
  preview,
  load: loaders[key],
  Component: lazy(loaders[key]),
});

export const routes = [
  route("home", "/", "Home", "Grand Theft Auto VI fan site", "An unofficial guide to Grand Theft Auto VI: trailers, characters, Leonida and the November 19, 2026 launch.", art.bay.src),
  route("characters", "/characters", "Characters", "Characters", "Jason Duval, Lucia Caminos and the people of Leonida, as introduced by Rockstar Games.", art.duo.src),
  route("leonida", "/leonida", "Leonida", "The map of Leonida", "An interactive fan map of Leonida: Vice City, the Keys, Grassrivers, Port Gellhorn, Ambrosia and Mount Kalaga.", leonidaPreview),
  route("vehicles", "/vehicles", "Vehicles", "Vehicles", "A fan garage of the cars, boats and bikes of Leonida.", vehiclesPreview),
  route("gallery", "/gallery", "Gallery", "Gallery", "Artwork and stills from around Leonida.", photos["duo-skyline"].small),
  route("trailers", "/trailers", "Trailers", "Official trailers", "Every official Grand Theft Auto VI trailer and video from Rockstar Games.", yt("rz1B4B2yBZY")),
  route("news", "/news", "News", "News", "A timeline of official Grand Theft Auto VI announcements.", yt("EiQEBYDox_k")),
  route("editions", "/editions", "Editions", "Editions and pre-order", "Grand Theft Auto VI editions and where to pre-order.", editionsPreview),
  route("about", "/about", "About", "About and contact", "About this fan project, and how to get in touch.", yt("VQRLujxTm3c")),
];

export const notFoundRoute = route("notFound", "*", "Wasted", "Page not found", "This page doesn't exist.", null);

export const navRoutes = routes;

export function findRoute(pathname) {
  const clean = pathname.replace(/\/+$/, "") || "/";
  return routes.find((r) => r.path === clean) ?? notFoundRoute;
}
