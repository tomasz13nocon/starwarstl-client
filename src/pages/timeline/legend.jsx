import { useEffect, useReducer, useRef } from "react";
import clsx from "clsx";
import c from "./styles/legend.module.scss";
import CircleButton from "./circleButton";

const ANIMATION_TIME = 180;
const CIRCLE_HEIGHT = 60;

export default function Legend() {
  const [expanded, toggleExpanded] = useReducer((state) => !state, false);
  const btnRef = useRef();

  useEffect(() => {
    if (btnRef.current) {
      btnRef.current.style.transition =
        "height " +
        ANIMATION_TIME +
        "ms ease-out, width " +
        ANIMATION_TIME +
        "ms ease-out, border-radius " +
        ANIMATION_TIME +
        "ms ease-out";
      btnRef.current.style.height = expanded
        ? Math.min(
          btnRef.current.scrollHeight /* + 4*/,
          window.innerHeight - CIRCLE_HEIGHT - 12 - 10 - 12,
        ) + "px" // The "4" is padding
        : CIRCLE_HEIGHT + "px";
      btnRef.current.style.width = expanded
        ? btnRef.current.scrollWidth + 4 + "px"
        : CIRCLE_HEIGHT + "px";
    }
  }, [expanded]);

  return (
    <CircleButton
      ref={btnRef}
      onClick={toggleExpanded}
      className={clsx(c.legendButton, expanded && c.expanded)}
    >
      {expanded ? (
        <>
          <div className={clsx("type-indicator", "book-a")}>Novel</div>
          <div className={clsx("type-indicator", "book-ya", c.small)}>Young Adult Novel</div>
          <div className={clsx("type-indicator", "book-jr", c.small)}>Junior Novel</div>
          <div className={clsx(c.hr)}></div>
          <div className={clsx("type-indicator", "yr")}>Young Reader</div>
          <div className={clsx(c.hr)}></div>
          <div className={clsx("type-indicator", "comic")}>Comic</div>
          <div className={clsx("type-indicator", "comic-strip", c.small)}>Comic strip</div>
          <div className={clsx("type-indicator", "comic-story", c.small)}>Comic story</div>
          <div className={clsx("type-indicator", "comic-manga", c.small)}>Manga</div>
          <div className={clsx(c.hr)}></div>
          <div className={clsx("type-indicator", "short-story")}>Short Story</div>
          <div className={clsx(c.hr)}></div>
          <div className={clsx("type-indicator", "tv")}>TV Series</div>
          <div className={clsx("type-indicator", "tv-animated", c.small)}>Animated TV series</div>
          <div className={clsx("type-indicator", "tv-micro-series", c.small)}>Micro-series</div>
          <div className={clsx("type-indicator", "tv-other", c.small)}>Other</div>
          <div className={clsx(c.hr)}></div>
          <div className={clsx("type-indicator", "game")}>Video game</div>
          <div className={clsx("type-indicator", "game-vr", c.small)}>VR game</div>
          <div className={clsx("type-indicator", "game-mobile", c.small)}>Mobile/browser game</div>
          <div className={clsx(c.hr)}></div>
          <div className={clsx("type-indicator", "audio-drama")}>Audio drama</div>
          <div className={clsx(c.hr)}></div>
          <div className={clsx("type-indicator", "film")}>Film</div>
          <div className={clsx(c.hr)}></div>
          <div className={clsx("type-indicator", "multimedia")}>Multimedia project</div>
          <div className={clsx(c.hr)}></div>
          <div className={clsx("type-indicator", "unreleased", c.tableCell, c.small)}>
            Unreleased
            <br />
            <small>(release date column)</small>
          </div>
          <div className={clsx("type-indicator", "exact-placement-unknown", c.tableCell, c.small)}>
            Exact placement currently
            <br />
            unknown <small>(date column)</small>
          </div>
        </>
      ) : (
        "?"
      )}
    </CircleButton>
  );
}
