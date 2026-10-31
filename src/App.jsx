import { Suspense, useEffect, useState } from "react";
import { Routes, Route } from "react-router";
import { initSmoothScroll, destroySmoothScroll } from "./animations/smooth";
import { stage } from "./animations/stage";
import { initMusic } from "./audio/music";
import { useScrollRefresh } from "./hooks/useScrollRefresh";
import { useRouteTransition } from "./hooks/useRouteTransition";
import { VideoProvider } from "./context/VideoContext";
import { routes, notFoundRoute } from "./data/routes";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import Grain from "./components/layout/Grain";
import PageTransition from "./components/layout/PageTransition";
import Preloader from "./components/layout/Preloader";
import Cursor from "./components/layout/Cursor";
import VideoModal from "./components/video/VideoModal";

function App() {
  useScrollRefresh();
  const location = useRouteTransition();
  const [booting, setBooting] = useState(true);
  // The home intro takes over straight from the preloader.
  const [handoff] = useState(() => location.pathname === "/");

  useEffect(() => {
    initSmoothScroll();
    const stopMusic = initMusic();
    return () => {
      stopMusic();
      destroySmoothScroll();
    };
  }, []);

  const NotFound = notFoundRoute.Component;

  return (
    <VideoProvider>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Header />
      <main id="main" tabIndex={-1}>
        <Suspense fallback={null}>
          <Routes location={location}>
            {routes.map((r) => {
              const Page = r.Component;
              return <Route key={r.key} path={r.path} element={<Page />} />;
            })}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
      <VideoModal />
      <PageTransition />
      {booting && <Preloader handoff={handoff} onReveal={() => stage.set({ revealed: true })} onDone={() => setBooting(false)} />}
      <Grain />
      <Cursor />
    </VideoProvider>
  );
}

export default App;
