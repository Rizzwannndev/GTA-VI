import { createContext, useCallback, useContext, useMemo, useState } from "react";

const VideoContext = createContext(null);

export function VideoProvider({ children }) {
  // { trailer, originRect } while the modal is open, otherwise null.
  const [active, setActive] = useState(null);

  const openVideo = useCallback((trailer, originEl) => {
    const originRect = originEl?.getBoundingClientRect?.() ?? null;
    setActive({ trailer, originRect });
  }, []);

  const closeVideo = useCallback(() => setActive(null), []);

  const value = useMemo(() => ({ active, openVideo, closeVideo }), [active, openVideo, closeVideo]);
  return <VideoContext.Provider value={value}>{children}</VideoContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useVideo() {
  const ctx = useContext(VideoContext);
  if (!ctx) throw new Error("useVideo must be used inside <VideoProvider>");
  return ctx;
}
