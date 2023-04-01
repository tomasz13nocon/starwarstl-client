import React from "react";
import { mdiFilterMultiple } from "@mdi/js";
import { Icon } from "@mdi/react";
import ClearableTextInput from "@components/clearableTextInput";
import "./styles/filters.scss";

const suggestionPriority = [
  "film",
  "tv-live-action",
  "game",
  "tv-animated",
  "multimedia",
  "book-a",
  "book-ya",
  "comic",
  "comic-manga",
  "audio-drama",
  "game-vr",
  "book-jr",
  "tv-micro-series",
  "comic-strip",
  "comic-story",
  "game-mobile",
  "short-story",
  "yr",
  "game-browser",
  "unknown",
];

export default React.memo(function Filters({
  seriesArr,
  filterText,
  filterTextChanged,
  suggestions,
  setSuggestions,
  boxFilters,
  setBoxFilters,
  showFilters,
  setShowFilters,
  filtersContainerRef,
  children,
}) {

    const [smallScreen, setSmallScreen] = React.useState(
      window.matchMedia("(max-width: 1086px)").matches
    );

    React.useEffect(() => {
      let e = window
      .matchMedia("(max-width: 1086px)")
      .addEventListener('change', e => setSmallScreen( e.matches ));
      return () => window.removeEventListener('change', e);
    }, []);

    const filterOnChange = (newFilterText) => {
      filterTextChanged(newFilterText);

      // Search suggestions
      let newSuggestions = [];
      if (newFilterText) {
        let queries = [newFilterText.toLowerCase()];
        let last = queries[queries.length - 1].trim();
        if (last.length >= 2) {
          let found = seriesArr.filter((item) =>
            item.displayTitle
              ? item.displayTitle.toLowerCase().includes(last)
              : item.title.toLowerCase().includes(last)
          );
          // TODO: indicate fetching of series
          if (found.length) {
            newSuggestions = found
              .filter((el) => !boxFilters.includes(el))
              .sort((a, b) => {
                let ap = suggestionPriority.indexOf(a.fullType || a.type),
                bp = suggestionPriority.indexOf(b.fullType || b.type);
                if (ap > bp) return 1;
                if (ap < bp) return -1;
                return 0;
              })
              .slice(0, 10);
          }
        }
      }
      setSuggestions(newSuggestions);
    };

    let content = (
      <div className="filters">
        <div>
          <ClearableTextInput
            value={filterText}
            onChange={filterOnChange}
            active={filterText}
            placeholder="Filter..."
            // clearOnClick={(e) => {
            //   filterTextChanged("");
            //   setSuggestions([]);
            // }}
          />
          {suggestions.length > 0 &&
            <div className="search-suggestions">
              <span className="suggestions-heading">Suggestions:</span>
              {suggestions.map((el) => (
                <button
                  key={el._id}
                  className={`reset-button suggestion ${el.type} ${el.fullType}`}
                  onClick={() => {
                    setBoxFilters([...boxFilters, el]);
                    filterTextChanged("");
                    setSuggestions([]);
                  }}
                >
                  {el.displayTitle || el.title}
                </button>
              ))}
            </div>
          }
        </div>


        {children}

      </div>
    );

    return (
      smallScreen ?
        <div className={`filters-container ${showFilters ? "visible" : ""}`} ref={filtersContainerRef}>
          {content}
          <div className={`filters-btn ${showFilters ? "filters-visible" : ""}`} onClick={() => setShowFilters(!showFilters)}>
            <Icon path={mdiFilterMultiple} size={1.6} className="icon" />
          </div>
        </div>
        :
        // <StickyBox className={`filters-container`} offsetTop={12} offsetBottom={12}>
          <div className="filters-container">
          {content}
          </div>
        // </StickyBox>
    );
  });
