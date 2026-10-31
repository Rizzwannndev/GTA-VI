import { useEffect } from "react";
import { Routes, Route } from "react-router";
import { initSmoothScroll, destroySmoothScroll } from "./animations/smooth";
import { stage } from "./animations/stage";
import { useScrollRefresh } from "./hooks/useScrollRefresh";
import Grain from "./components/layout/Grain";
import Home from "./pages/Home";

function App() {
  useScrollRefresh();

  useEffect(() => {
    initSmoothScroll();
    stage.set({ revealed: true });
    return () => destroySmoothScroll();
  }, []);

  return (
    <>
      <main id="main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </main>
      <Grain />
    </>
  );
}

export default App;
