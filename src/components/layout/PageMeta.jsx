import { routes, notFoundRoute } from "../../data/routes";
import { SITE_NAME } from "../../data/site";

// Per-route <title> and meta tags. React 19 hoists these into <head>.
export default function PageMeta({ route, title, description }) {
  const r = routes.find((x) => x.key === route) ?? notFoundRoute;
  const fullTitle = `${title ?? r.title} | ${SITE_NAME}`;
  const desc = description ?? r.description;
  return (
    <>
      <title>{fullTitle}</title>
      <meta name="description" content={desc} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={desc} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={desc} />
    </>
  );
}
