// Every route in one list: path, the name shown in menus and in the page
// transition, its <title>/meta description, the menu preview image, and a
// lazy loader (also used to preload the page during the transition).
import { lazy } from "react";
import { photos } from "../assets/photos/photos";

// Menu previews: one official screenshot per page.
const shot = (key) => photos[key].small;

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

const route = (key, path, name, title, description, preview, blurb) => ({
  key,
  path,
  name,
  title,
  description,
  preview,
  blurb,
  load: loaders[key],
  Component: lazy(loaders[key]),
});

export const routes = [
  route("home", "/", "Home", "Grand Theft Auto VI fan site", "An unofficial guide to Grand Theft Auto VI: trailers, characters, Leonida and the November 19, 2026 launch.", shot("vice-city"), "The bay at golden hour"),
  route("characters", "/characters", "Characters", "Characters", "Jason Duval, Lucia Caminos and the people of Leonida, as introduced by Rockstar Games.", shot("duo-dusk"), "Jason, Lucia and co."),
  route("leonida", "/leonida", "Leonida", "The map of Leonida", "An interactive fan map of Leonida: Vice City, the Keys, Grassrivers, Port Gellhorn, Ambrosia and Mount Kalaga.", shot("vice-beach"), "Six regions, one state"),
  route("vehicles", "/vehicles", "Vehicles", "Vehicles", "A fan garage of the cars, boats and bikes of Leonida.", shot("speedboat"), "Cars, boats and bikes"),
  route("gallery", "/gallery", "Gallery", "Gallery", "Artwork and stills from around Leonida.", shot("duo-skyline"), "Screenshots and stills"),
  route("trailers", "/trailers", "Trailers", "Official trailers", "Every official Grand Theft Auto VI trailer and video from Rockstar Games.", shot("jason-night"), "Six official videos"),
  route("news", "/news", "News", "News", "A timeline of official Grand Theft Auto VI announcements.", shot("port-gellhorn-night"), "Every announcement"),
  route("editions", "/editions", "Editions", "Editions and pre-order", "Grand Theft Auto VI editions and where to pre-order.", shot("sports-coupe"), "Editions and pre-order"),
  route("about", "/about", "About", "About and contact", "About this fan project, and how to get in touch.", shot("palms"), "The project and contact"),
];

export const notFoundRoute = route("notFound", "*", "Wasted", "Page not found", "This page doesn't exist.", null);

export const navRoutes = routes;

export function findRoute(pathname) {
  const clean = pathname.replace(/\/+$/, "") || "/";
  return routes.find((r) => r.path === clean) ?? notFoundRoute;
}
