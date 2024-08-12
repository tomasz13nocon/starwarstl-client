import { createContext, useContext, useRef, useState } from "react";

/*
 * Context to track swiping state of elements, swiping of which should prevent global swiping events (like sidebar in timeline)
 * */

const SwipeContext = createContext();

export const useSwipeContext = () => {
  return useContext(SwipeContext);
};

export function SwipeProvider({ children }) {
  const [swiping, setSwiping] = useState(false);

  const timeoutId = useRef(null);

  function onSwipeStart() {
    if (timeoutId.current) clearTimeout(timeoutId.current);
    setSwiping(true);
  }

  function onSwipeEnd() {
    // Debounce, because global swipe can trigger right after ending this swipe
    if (timeoutId.current) clearTimeout(timeoutId.current);
    timeoutId.current = setTimeout(() => {
      setSwiping(false);
    }, 100);
  }

  return (
    <SwipeContext.Provider
      value={{
        swiping,
        onSwipeStart,
        onSwipeEnd,
      }}
    >
      {children}
    </SwipeContext.Provider>
  );
}
