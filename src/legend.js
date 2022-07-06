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
        ? Math.min(btnRef.current.scrollHeight/* + 4*/, window.innerHeight - 70 - 12 - 10 - 12) + "px" // The "4" is padding
        : "70px";
      btnRef.current.style.width = expanded
        ? btnRef.current.scrollWidth + 4 + "px"
        : "70px";
    }
  }, [expanded]);

  return (
    <div
      ref={btnRef}
      onClick={toggleExpanded}
      className={`legend-button circle-button button ${
        expanded ? "expanded" : ""
      }`}
    >
      {expanded ? (
        <>
          {/* TODO: fix the order to reflect the color circle once the colors are settled */}
          <div className="type-indicator book-a">Novel</div>
          <div className="type-indicator book-ya small">Young Adult Novel</div>
          <div className="type-indicator book-jr small">Junior Novel</div>
          <div className="hr"></div>
          <div className="type-indicator yr">Young Reader</div>
          <div className="hr"></div>
          <div className="type-indicator comic">Comic</div>
          <div className="type-indicator comic-strip small">Comic strip</div>
          <div className="type-indicator comic-story small">Comic story</div>
          <div className="type-indicator comic-manga small">Manga</div>
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
          <div className="type-indicator game-vr small">VR game</div>
          <div className="type-indicator game-mobile small">
            Mobile/browser game
          </div>
          <div className="hr"></div>
          <div className="type-indicator audio-drama">Audio drama</div>
          <div className="hr"></div>
          <div className="type-indicator film">Film</div>
          <div className="hr"></div>
          <div className="type-indicator multimedia">Multimedia project</div>
          <div className="hr"></div>
          <div className="unreleased table-cell type-indicator small">
            Unreleased
            <br />
            <small>(release date column)</small>
          </div>
          <div className="exact-placement-unknown table-cell type-indicator small">
            Exact placement currently
            <br />
            unknown <small>(date column)</small>
          </div>
          {/* <div */}
          {/*   className="type-indicator unknown" */}
          {/*   style={{ border: "1px solid black" }} */}
          {/* > */}
          {/*   Unknown */}
          {/* </div> */}
        </>
      ) : (
        "?"
      )}
    </div>
  );
}
