import React, { Fragment } from "react";
import { Virtuoso } from "react-virtuoso";
import MessageImg from "@components/messageImg";
import SortingIcon from "@components/sortingIcon";
import Error from "@components/error";
import { escapeRegex, searchFields, notSortable, columnNames } from "@/util";
import Row from "./row";
import "./styles/timeline.scss";
import {
  Filterer,
  collapseAdjacentEntries,
  createFieldStrategy,
  createRangeStrategy,
  createSorter,
  createTextStrategy,
  createTypeStrategy,
  getMatchedApps,
} from "./filtering";
import FetchingImg from "@components/fetchingImg";
import AppearanceShield from "@components/rowDetails/appearanceShield";
import MatchedAppearances from "./matchedAppearances";

function Table({
  filterText,
  filterCategory,
  typeFilters,
  rawData,
  boxFilters,
  boxFiltersAnd,
  searchExpanded,
  searchResults,
  dispatchSearchResults,
  hideUnreleased,
  hideAdaptations,
  collapseAdjacent,
  columns,
  dataState,
  sorting,
  toggleSorting,
  rangeFrom,
  rangeTo,
  timelineRangeBy,
  setFullCover,
  appearances,
  appearancesFilters,
}) {
  const [expanded, setExpanded] = React.useState(null);

  const virtuoso = React.useRef(null);
  const renderedRange = React.useRef(null);
  const activeColumns = React.useMemo(
    () => Object.keys(columns).filter((name) => columns[name]),
    [columns]
  );

  // Scroll to highlighted search result
  React.useEffect(() => {
    if (searchResults.highlight && renderedRange.current) {
      let behavior = "auto";
      let highlightIndex = searchResults.results[searchResults.highlight.resultsIndex].rowIndex;
      if (
        highlightIndex >= renderedRange.current.startIndex &&
        highlightIndex <= renderedRange.current.endIndex
      ) {
        behavior = "smooth";
      }
      virtuoso.current.scrollToIndex({
        index: highlightIndex,
        align: "center",
        behavior: behavior,
      });
    }
  }, [searchResults.highlight]);

  // We need these for scroll effect as well
  const sortFilterDeps = [
    rawData,
    typeFilters,
    filterText,
    filterCategory,
    sorting,
    boxFilters,
    boxFiltersAnd,
    hideUnreleased,
    hideAdaptations,
    collapseAdjacent,
    rangeFrom,
    rangeTo,
    timelineRangeBy,
    appearances,
    appearancesFilters,
  ];

  // Sort and filter data
  const data = React.useMemo(() => {
    if (rawData.length === 0) return [];

    const strategies = [];

    if (rangeFrom || rangeTo) {
      strategies.push(createRangeStrategy(rangeFrom, rangeTo, timelineRangeBy));
    }

    if (hideUnreleased) {
      strategies.push((item) => !item.unreleased);
    }

    if (hideAdaptations) {
      strategies.push((item) => !item.adaptation);
    }

    strategies.push(createTypeStrategy(typeFilters));

    if (boxFilters.length) {
      strategies.push(createFieldStrategy(boxFilters, boxFiltersAnd, appearancesFilters));
    }

    if (filterText) {
      strategies.push(
        createTextStrategy(filterText, filterCategory, appearances, appearancesFilters)
      );
    }

    if (sorting.by === "chronology") {
      // Remove items with unknown placement, the ones from the other table
      // TODO: maybe notify user that some items have been hidden?
      strategies.push((item) => item.chronology != null);
    }

    const filterer = new Filterer(rawData, strategies);
    let tempData = filterer.filter();

    let by = sorting.by === "date" ? "chronology" : sorting.by;
    tempData = tempData.sort(createSorter(by, sorting.ascending));

    // Collapse adjacent entries. This must be the last step
    if (collapseAdjacent && tempData.length > 2) {
      tempData = collapseAdjacentEntries(tempData);
    }

    tempData.incomplete = rawData.incomplete;
    return tempData;
  }, sortFilterDeps);

  const scrollToId = React.useCallback(
    (id) => {
      let index = data.findIndex((e) => e._id === id);
      if (index !== -1) {
        virtuoso.current?.scrollToIndex({
          index: index,
          align: "center",
          // behavior: behavior,
          // offset: -100,
        });
      }
    },
    [data, virtuoso.current]
  );

  // Scroll to expanded entry on data change.
  React.useEffect(() => {
    if (expanded) {
      scrollToId(expanded);
    }
  }, sortFilterDeps);

  // Search (Ctrl-F replacement)
  React.useEffect(() => {
    const findAllIndices = (str, searchText) =>
      [...str.matchAll(new RegExp(escapeRegex(searchText), "gi"))].map((a) => a.index);
    if (searchExpanded) {
      let overallSize = 0;
      if (searchResults.text === "") {
        dispatchSearchResults({
          type: "setResults",
          payload: { results: [], overallSize: overallSize },
        });
      } else {
        let results = [];
        for (let [rowIndex, item] of data.entries()) {
          for (let field of searchFields) {
            if (typeof item[field] === "string") {
              let indices = findAllIndices(item[field], searchResults.text);
              if (indices.length) {
                results.push({
                  rowIndex: rowIndex,
                  id: item._id,
                  field: field,
                  indices: indices,
                });
                overallSize += indices.length;
              }
            } else if (Array.isArray(item[field])) {
              for (let [arrayIndex, arrayItem] of item[field].entries()) {
                if (typeof arrayItem !== "string")
                  console.error("Unknown field type while searching (array of non strings)");
                let indices = findAllIndices(arrayItem, searchResults.text);
                if (indices.length) {
                  results.push({
                    // TODO should this be a dict with IDs as keys?
                    rowIndex: rowIndex,
                    id: item._id,
                    field: field,
                    arrayIndex: arrayIndex,
                    indices: indices,
                  });
                  overallSize += indices.length;
                }
              }
            } else if (item[field] !== undefined) {
              console.error(
                "Unknown field type while searching. Expected string or array of strings. Got: " +
                typeof item[field]
              );
            }
          }
        }

        dispatchSearchResults({
          type: "setResults",
          payload: { results: results, overallSize: overallSize },
        });
      }
    }
  }, [searchResults.text, data]);

  const matchedApps = getMatchedApps();
  const matchedBoxFilterApps = boxFilters
    .filter((f) => f.category)
    .reduce((acc, f) => {
      for (let media of f.media) {
        acc[media.id] = acc[media.id] || [];
        //
        acc[media.id].push({
          name: f.name,
          ...(media.t ? { t: media.t } : {}),
        });
      }
      return acc;
    }, {});

  return (
    <div className="container table">
      <div className="thead">
        {activeColumns.map((name) => (
          <div
            onClick={(e) => toggleSorting(name)}
            key={name}
            className={name + " th" + (notSortable.includes(name) ? " not-sortable" : "")}
          >
            <div className="th-inner">
              {columnNames[name] || name}
              <SortingIcon sorting={sorting} name={name} />
            </div>
          </div>
        ))}
      </div>
      <div className="tbody">
        {dataState === "fetching" && <FetchingImg />}
        {dataState === "error" && <Error />}
        {dataState === "ok" && data.length === 0 && (
          <MessageImg img="void">
            There&apos;s nothing here...
            <br />
            <span className="small">(Try changing the filters or the query)</span>
          </MessageImg>
        )}
        <Virtuoso
          ref={virtuoso}
          useWindowScroll={true}
          overscan={200}
          data={data}
          rangeChanged={(range) => (renderedRange.current = range)}
          itemContent={(index, item) => {
            // The index in searchResults.results array of the first result in this row
            let resultsIndex = searchResults.results.findIndex((r) => r.rowIndex === index);
            let rowResultCount = 0,
              rowSearchResults = [];

            // Get the search results in current row
            if (resultsIndex !== -1) {
              do {
                rowResultCount++;
              } while (searchResults.results[resultsIndex + rowResultCount]?.rowIndex === index);
              rowSearchResults = searchResults.results.slice(
                resultsIndex,
                resultsIndex + rowResultCount
              );
            }

            return (
              <div className="tr-outer">
                <Row
                  item={item}
                  activeColumns={activeColumns}
                  setFullCover={setFullCover}
                  expanded={expanded === item._id}
                  setExpanded={setExpanded}
                  searchExpanded={searchExpanded}
                  searchResultsHighlight={
                    searchResults.highlight
                      ? {
                        resultsOffset: searchResults.highlight.resultsIndex - resultsIndex,
                        indicesIndex: searchResults.highlight.indicesIndex,
                      }
                      : null
                  }
                  rowSearchResults={rowSearchResults}
                  searchText={searchResults.text}
                  collapseAdjacent={collapseAdjacent}
                  dataState={dataState}
                  scrollToId={scrollToId}
                >
                  {filterCategory && filterText && (
                    <MatchedAppearances appearances={matchedApps[item._id]}>
                      {/* TODO maybe limit the amount of shown matches */}
                      <span className="bold">Matched {filterCategory}: </span>
                    </MatchedAppearances>
                  )}
                  {matchedBoxFilterApps.length !== 0 && (
                    <MatchedAppearances
                      appearances={matchedBoxFilterApps[item._id]}
                    ></MatchedAppearances>
                  )}
                </Row>
              </div>
            );
          }}
        />
      </div>
    </div>
  );
}
export default React.memo(Table);
