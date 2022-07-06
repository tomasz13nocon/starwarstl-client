import React from "react";
import _ from "lodash";
import { mdiClose } from "@mdi/js";
import Icon from "@mdi/react";

import CheckboxGroup from "./checkboxGroup.js";
import WookieeLink from "./wookieeLink.js";
import "./styles/filters.scss";

export default React.memo(function Filters({
  filterText,
  filterTextChanged,
  filters,
  filtersChanged,
  filtersTemplate,
  suggestions,
  setSuggestions,
  boxFilters,
  setBoxFilters,
  timelineContainerRef,
}) {
  let checkboxFiltersRef = React.useRef();
  let filtersRef = React.useRef();
  const [filtersHeight, setFiltersHeight] = React.useState(0);

  const resizeFilters = React.useCallback(() => {
    let winH = window.innerHeight;
    let top = checkboxFiltersRef.current.getBoundingClientRect().top;
    let timelineContainerBottom = 0;
    if (timelineContainerRef.current) {
      timelineContainerBottom =
        timelineContainerRef.current.getBoundingClientRect().bottom;
    }
    if (timelineContainerBottom < winH) {
      // The footer is showing
      let topDiff =
        checkboxFiltersRef.current.getBoundingClientRect().top -
        filtersRef.current.getBoundingClientRect().top +
        10; // 10 due to sticky position: 10
      let newHeight = winH - topDiff - (winH - timelineContainerBottom);
      setFiltersHeight(newHeight);
    } else {
      setFiltersHeight(winH - top);
    }
  }, []);

  React.useEffect(() => {
    resizeFilters();
  }, [suggestions, boxFilters, filterText]);

  React.useEffect(() => {
    if (checkboxFiltersRef.current) {
      resizeFilters();
      if (filtersRef.current) {
      }
    }
  }, [checkboxFiltersRef.current, filtersRef.current]);

  React.useEffect(() => {
    document.addEventListener("scroll", resizeFilters);
    window.addEventListener("resize", resizeFilters);
    return () => {
      document.removeEventListener("scroll", resizeFilters);
      window.removeEventListener("resize", resizeFilters);
    };
  }, []);

  return (
    <div className="filter" ref={filtersRef}>
      <div className="search clear-input-container">
        <input
          type="text"
          value={filterText}
          onChange={(e) => filterTextChanged(e.target.value)}
          placeholder="Filter..."
          className="input-default"
        />
        {filterText ? (
          <button
            className="clear-input"
            onClick={(e) => filterTextChanged("")}
            aria-label="Clear search"
          >
            &times;
          </button>
        ) : null}
      </div>

      <div className="search-suggestions">
        {suggestions.length > 0 && <span className="suggestions-heading">Suggestions:</span>}
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

      <div className="box-filters">
        {boxFilters.map((boxFilter) => (
          <div
            key={boxFilter._id}
            className={`type-indicator ${boxFilter.type} ${boxFilter.fullType}`}
          >
            <span className="text">
              {boxFilter.displayTitle || boxFilter.title}
              <WookieeLink title={boxFilter.title}></WookieeLink>
            </span>
            <button
              className={`reset-button curp remove ${boxFilter.type}-reversed ${boxFilter.fullType}-reversed`}
              onClick={() =>
                setBoxFilters([
                  ...boxFilters.filter((el) => el._id !== boxFilter._id),
                ])
              }
            >
              <Icon className={`icon`} path={mdiClose} />
            </button>
          </div>
        ))}
      </div>

      <div className="check-buttons">
        <button
          className="show-button"
          onClick={() => filtersChanged({ path: "type", to: true })}
        >
          CHECK ALL
        </button>
        <button
          className="hide-button"
          onClick={() => filtersChanged({ path: "type", to: false })}
        >
          UNCHECK ALL
        </button>
      </div>

      <div
        className="checkbox-filters"
        ref={checkboxFiltersRef}
        style={{ height: filtersHeight }}
      >
        <CheckboxGroup state={filters} onChange={filtersChanged}>
          {filtersTemplate}
        </CheckboxGroup>
      </div>
    </div>
  );
});
