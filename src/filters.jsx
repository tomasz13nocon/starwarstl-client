import React from "react";
import { _ } from "lodash";
import { mdiClose, mdiFilterMultiple } from "@mdi/js";
import { Icon } from "@mdi/react";
import StickyBox from "react-sticky-box";

import CheckboxGroup from "./checkboxGroup";
import WookieeLink from "./wookieeLink";
import "./styles/filters.scss";
import Checkbox from "./checkbox";
import { columnNames, notSortable } from "./common";
import SortingIcon from "./sortingIcon";

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
  hideUnreleased,
  setHideUnreleased,
  seriesArr,
  collapseAdjacent,
  setCollapseAdjacent,
  columns,
  setColumns,
  showFilters,
  setShowFilters,
  filtersContainerRef,
  sorting,
  toggleSorting,
}) {

  const [smallScreen, setSmallScreen] = React.useState(
    window.matchMedia("(max-width: 1086px)").matches
  );

  React.useEffect(() => {
    window
      .matchMedia("(max-width: 1086px)")
      .addEventListener('change', e => setSmallScreen( e.matches ));
  }, []);

  let content = (
    <div className="filters">
      <div className="search clear-input-container">
        <input
          type="text"
          value={filterText}
          onChange={(e) => {
            let newFilterText = e.target.value;
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
          }}
          placeholder="Filter..."
          className={`input-default ${filterText ? "non-empty" : ""}`}
        />
        {filterText ? (
          <button
            className="clear-input"
            onClick={(e) => {
              filterTextChanged("");
              setSuggestions([]);
            }}
            aria-label="Clear search"
          >
            &times;
          </button>
        ) : null}
      </div>

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

      {boxFilters.length > 0 &&
        <div className="box-filters">
          <h2 className="title">Active filters:</h2>
          {boxFilters.map((boxFilter) => (
            <div
              key={boxFilter._id}
              className={`type-indicator2 ${boxFilter.type} ${boxFilter.fullType}`}
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
      }

      <hr />

      <div className="sorting-mobile">
        <h2 className="title">Sort by:</h2>
        <div className="sorting-btns">
          {Object.keys(columns).filter(c => !notSortable.includes(c)).map((column) => (
            <div className={`sorting-btn ${sorting.by === column ? "active" : ""}`} key={column} onClick={(e) => toggleSorting(column)}>
              {columnNames[column]}
              <SortingIcon sorting={sorting} name={column} />
            </div>
          ))}
        </div>

        <hr />
      </div>

      <div className="column-settings">
        <h2 className="title">Show columns:</h2>
        {Object.entries(columns)
            .filter(e => e[0] !== "title") // Don't allow hiding title
            .map(([column, value]) => (
              <Checkbox
                key={column}
                name={columnNames[column]}
                value={value}
                onChange={({ to }) => setColumns(state => ({ ...state, [column]: to }))}
              />
            ))}
      </div>

      <hr />

      <div className="checkbox-settings">
        <Checkbox
          name={"Hide unreleased"}
          value={hideUnreleased}
          onChange={({ to }) => setHideUnreleased(to)}
        />
        <Checkbox
          name={"Collapse adjacent episodes"}
          value={collapseAdjacent}
          onChange={({ to }) => setCollapseAdjacent(to)}
        />
      </div>

      <hr />

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
      >
        <CheckboxGroup state={filters} onChange={filtersChanged}>
          {filtersTemplate}
        </CheckboxGroup>
      </div>
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
    <StickyBox className={`filters-container`} offsetTop={12} offsetBottom={12}>
      {content}
    </StickyBox>
  );
});
