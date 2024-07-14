import React from "react";
import { mdiMagnify, mdiClose, mdiChevronUp, mdiChevronDown } from "@mdi/js";
import c from "./styles/search.module.scss";
import Icon from "@components/icon";
import CircleButton from "./circleButton";

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
    <div className={c.searchContainer}>
      {expanded ? (
        <>
          <input
            className={c.searchInput}
            ref={searchInputRef}
            type="text"
            placeholder="Search..."
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
          <div className={c.buttonContainer}>
            <span className={c.resultCount}>
              {searchResults.highlight?.overallIndex ?? 0}/{searchResults.overallSize}
            </span>
            <button
              onClick={(e) => dispatchSearchResults({ type: "highlightPrev" })}
              aria-label="Clear search"
            >
              <Icon path={mdiChevronUp} size={1.5} />
            </button>
            <button
              onClick={(e) => dispatchSearchResults({ type: "highlightNext" })}
              aria-label="Clear search"
            >
              <Icon path={mdiChevronDown} size={1.5} />
            </button>
            <button onClick={(e) => toggleExpanded()} aria-label="Clear search">
              <Icon path={mdiClose} size={1.5} />
            </button>
          </div>
        </>
      ) : (
        <CircleButton className={c.searchButton} onClick={toggleExpanded} aria-label="Search">
          <Icon path={mdiMagnify} size={1.5} />
        </CircleButton>
      )}
    </div>
  );
}
