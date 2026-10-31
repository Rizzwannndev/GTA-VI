import { Suspense, useEffect } from "react";
import { Routes, Route } from "react-router";
import { initSmoothScroll, destroySmoothScroll } from "./animations/smooth";
import { stage } from "./animations/stage";
import { useScrollRefresh } from "./hooks/useScrollRefresh";
import { VideoProvider } from "./context/VideoContext";
import { routes, notFoundRoute } from "./data/routes";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import Grain from "./components/layout/Grain";
import VideoModal from "./components/video/VideoModal";

function App() {
  useScrollRefresh();

  useEffect(() => {
    initSmoothScroll();
    stage.set({ revealed: true });
    return () => destroySmoothScroll();
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
          <Routes>
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
      <Grain />
    </VideoProvider>
  );
}

export default App;
