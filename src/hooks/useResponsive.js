import { useEffect, useState } from "react";

export default function useResponsive(breakpoint) {
  const mediaQuery = `(max-width: ${breakpoint}px)`;

  const [smallScreen, setSmallScreen] = useState(window.matchMedia(mediaQuery).matches);

  useEffect(() => {
    const e = window
      .matchMedia(mediaQuery)
      .addEventListener("change", (e) => setSmallScreen(e.matches));
    return () => window.removeEventListener("change", e);
  }, []);

  return smallScreen;
}
