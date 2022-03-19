import React from "react";
import "./styles/legend.scss";

const ANIMATION_TIME = 180;

export default function Legend(props) {
  const [expanded, toggleExpanded] = React.useReducer((state) => !state, false);
  const btnRef = React.useRef();

  React.useEffect(() => {
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
        ? btnRef.current.scrollHeight + 4 + "px" // The "4" is padding
        : "70px";
      btnRef.current.style.width = expanded
        ? btnRef.current.scrollWidth + 4 + "px"
        : "70px";
    }
  }, [expanded]);

  return (
    <div className="legend">
      <button
        ref={btnRef}
        onClick={toggleExpanded}
        className={`button ${expanded ? "expanded" : ""}`}
      >
        {expanded ? (
          <>
            {/* TODO: fix the order to reflect the color circle once the colors are settled */}
            <div className="type-indicator book-a">Novel</div>
            <div className="type-indicator book-ya small">
              Young Adult Novel
            </div>
            <div className="type-indicator book-jr small">Junior Novel</div>
            <div className="hr"></div>
            <div className="type-indicator yr">Young Reader</div>
            <div className="hr"></div>
            <div className="type-indicator comic">Comic</div>
            <div className="hr"></div>
            <div className="type-indicator short-story">Short Story</div>
            <div className="hr"></div>
            <div className="type-indicator tv">TV Series</div>
            <div className="type-indicator tv-animated small">
              Animated TV series
            </div>
            <div className="type-indicator tv-micro-series small">
              Micro-series
            </div>
            <div className="hr"></div>
            <div className="type-indicator game">Video game</div>
            <div className="type-indicator game-mobile small">
              Mobile/browser game
            </div>
            <div className="type-indicator game-vr small">VR game</div>
            <div className="hr"></div>
            <div className="type-indicator audio-drama">Audio drama</div>
            <div className="hr"></div>
            <div className="type-indicator film">Film</div>
          </>
        ) : (
          "?"
        )}
      </button>
    </div>
  );
}
