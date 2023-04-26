import React from "react";
import { Icon } from "@mdi/react";
import { mdiMagnify, mdiClose, mdiChevronUp, mdiChevronDown } from "@mdi/js";
import "./styles/search.scss";

export default function Search({ expanded, toggleExpanded, searchResults, dispatchSearchResults }) {
  const searchInputRef = React.useRef();

  React.useEffect(() => {
    let handler = function (e) {
      if (e.keyCode === 114 || (e.ctrlKey && e.keyCode === 70) || (e.ctrlKey && e.keyCode === 71)) {
        if (e.keyCode === 70 && document.activeElement === searchInputRef.current) return;
        e.preventDefault();
        toggleExpanded(true);
        searchInputRef.current?.focus();
        if (e.keyCode === 71 || e.keyCode === 114) {
          // ctrl-g or F3
          if (e.shiftKey) dispatchSearchResults({ type: "highlightPrev" });
          else dispatchSearchResults({ type: "highlightNext" });
        }
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <div className="search-container">
      {expanded ? (
        <>
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search..."
            className="input-default"
            value={searchResults.text}
            onChange={(e) =>
              dispatchSearchResults({
                type: "setText",
                payload: e.target.value,
              })
            }
            autoFocus
            onKeyDown={(e) => e.key === "Escape" && toggleExpanded()}
          />
          <div className="button-container">
            <span className="result-count">
              {searchResults.highlight?.overallIndex ?? 0}/{searchResults.overallSize}
            </span>
            <button
              onClick={(e) => dispatchSearchResults({ type: "highlightPrev" })}
              aria-label="Clear search"
            >
              <Icon path={mdiChevronUp} size={1.5} className="icon" />
            </button>
            <button
              onClick={(e) => dispatchSearchResults({ type: "highlightNext" })}
              aria-label="Clear search"
            >
              <Icon path={mdiChevronDown} size={1.5} className="icon" />
            </button>
            <button onClick={(e) => toggleExpanded()} aria-label="Clear search">
              <Icon path={mdiClose} size={1.5} className="icon" />
            </button>
          </div>
        </>
      ) : (
        <button
          className={`circle-button search-button`}
          onClick={toggleExpanded}
          aria-label="Search"
        >
          <Icon path={mdiMagnify} size={1.5} className="icon" />
        </button>
      )}
    </div>
  );
}
