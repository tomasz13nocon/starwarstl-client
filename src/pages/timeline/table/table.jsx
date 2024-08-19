import React, { useEffect, useRef, useMemo, useState, useCallback } from "react";
import { Virtuoso } from "react-virtuoso";
import MessageBox from "@components/inlineAlerts/messageBox";
import SortingIcon from "@components/sortingIcon";
import NetworkError from "@components/inlineAlerts/networkError";
import { escapeRegex, searchFields, notSortable, columnNames, columnSorter } from "@/util";
import Row from "./row";
import "./styles/timeline.scss";
import {
  collapseAdjacentEntries,
  createFieldStrategy,
  createListStrategy,
  createRangeStrategy,
  createSorter,
  createTextStrategy,
  createTypeStrategy,
  getMatchedApps,
} from "./filtering";
import Fetching from "@components/inlineAlerts/fetching";
import MatchedAppearances from "./matchedAppearances";
import Checkbox from "@components/checkbox";
import clsx from "clsx";

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
  listFilters,
  appearances,
  appearancesFilters,
  selected,
  setSelected,
}) {
  const [expanded, setExpanded] = useState(null);

  const virtuoso = useRef(null);
  const renderedRange = useRef(null);
  const activeColumns = useMemo(
    () =>
      Object.keys(columns)
        .sort(columnSorter)
        .filter((name) => columns[name]),
    [columns],
  );

  // Scroll to highlighted search result
  useEffect(() => {
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

  // We need this for scroll effect as well
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
    listFilters,
  ];

  const rangeStrategy = useMemo(() => {
    if (rangeFrom || rangeTo) {
      return createRangeStrategy(rangeFrom, rangeTo, timelineRangeBy);
    }
  }, [rangeFrom, rangeTo, timelineRangeBy]);

  const unreleasedStrategy = useMemo(() => {
    if (hideUnreleased) {
      return (item) => !item.unreleased;
    }
  }, [hideUnreleased]);

  const adaptationsStrategy = useMemo(() => {
    if (hideAdaptations) {
      return (item) => !item.adaptation;
    }
  }, [hideAdaptations]);

  const typeStrategy = useMemo(() => {
    return createTypeStrategy(typeFilters);
  }, [typeFilters]);

  const fieldStrategy = useMemo(() => {
    if (boxFilters.length) {
      return createFieldStrategy(boxFilters, boxFiltersAnd, appearancesFilters);
    }
  }, [boxFilters, boxFiltersAnd, appearancesFilters]);

  const listStrategy = useMemo(() => {
    if (listFilters.length) {
      return createListStrategy(listFilters);
    }
  }, [listFilters]);

  const textStrategy = useMemo(() => {
    if (filterText) {
      return createTextStrategy(filterText, filterCategory, appearances, appearancesFilters);
    }
  }, [filterText, filterCategory, appearances, appearancesFilters]);

  // Sort and filter data
  const data = useMemo(() => {
    if (rawData.length === 0) return [];

    const strategies = [
      rangeStrategy,
      unreleasedStrategy,
      adaptationsStrategy,
      typeStrategy,
      fieldStrategy,
      listStrategy,
      textStrategy,
    ].filter((s) => s !== undefined); // Remove inactive strategies

    let tempData = rawData.filter((item) => strategies.every((strategy) => strategy(item)));

    let by = sorting.by === "date" ? "chronology" : sorting.by;
    tempData.sort(createSorter(by, sorting.ascending));

    // Collapse adjacent entries. This must be the last step
    if (collapseAdjacent && tempData.length > 2) {
      tempData = collapseAdjacentEntries(tempData);
    }

    tempData.incomplete = rawData.incomplete;
    return tempData;
  }, sortFilterDeps);

  const dataSelectable = useMemo(
    () => new Set(data.filter((item) => item.pageid != null).map((item) => item.pageid)),
    [data],
  );

  const scrollToId = useCallback(
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
    [data, virtuoso.current],
  );

  // Scroll to expanded entry on data change.
  // useEffect(() => {
  //   // TODO put this behavior behind a setting
  //   if (expanded) {
  //     setTimeout(() => {
  //       let isExpandedInView = false;
  //       // Scroll only if not already in view
  //       console.log("SCROLL EFFECT RUNNING.");
  //       console.log("data length:", data.length);
  //       console.log(
  //         `Visible renderedRange.current is from ${renderedRange.current.startIndex} to ${renderedRange.current.endIndex}.\nFrom ${data[renderedRange.current.startIndex]?.title} to ${data[renderedRange.current.endIndex]?.title}`,
  //       );
  //       for (let i = renderedRange.current.startIndex; i <= renderedRange.current.endIndex; i++) {
  //         if (data[i] == null) console.error("data[" + i + "] is undefined!");
  //         if (data[i] && data[i]._id === expanded) {
  //           console.log("scrolling");
  //           isExpandedInView = true;
  //           break;
  //         }
  //       }
  //       if (!isExpandedInView) scrollToId(expanded);
  //     }, 50);
  //   }
  // }, [data]);

  // Search (Ctrl-F replacement)
  useEffect(() => {
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
                  typeof item[field],
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

  const selectAllOnChange = useCallback(
    (value) => {
      setSelected(value ? dataSelectable : new Set());
    },
    [dataSelectable],
  );

  return (
    <main className="container table">
      <div className="thead">
        {activeColumns.map((name) => (
          <div
            onClick={() => {
              if (!notSortable.includes(name)) toggleSorting(name);
            }}
            key={name}
            className={clsx(name, "th", notSortable.includes(name) && "not-sortable")}
          >
            <div className="th-inner">
              {name === "selection" ? (
                <Checkbox
                  value={selected.size !== 0}
                  indeterminate={selected.size > 0 && selected.size < dataSelectable.size}
                  onChange={selectAllOnChange}
                />
              ) : (
                columnNames[name]
              )}
              <SortingIcon sorting={sorting} name={name} />
            </div>
          </div>
        ))}
      </div>
      <div className="tbody">
        {dataState === "fetching" && <Fetching />}
        {dataState === "error" && <NetworkError />}
        {dataState === "ok" && data.length === 0 && (
          <MessageBox img="void">
            There&apos;s nothing here...
            <br />
            <span className="small">(Try changing the filters or the query)</span>
          </MessageBox>
        )}
        <Virtuoso
          ref={virtuoso}
          useWindowScroll={true}
          overscan={200}
          data={data}
          rangeChanged={(range) => {
            renderedRange.current = range;
          }}
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
                resultsIndex + rowResultCount,
              );
            }

            return (
              <div className="tr-outer">
                <Row
                  item={item}
                  activeColumns={activeColumns}
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
                  selected={selected.has(item.pageid)}
                  setSelected={setSelected}
                >
                  {filterCategory && filterText && (
                    <MatchedAppearances appearances={matchedApps[item._id]}>
                      {/* TODO maybe limit the amount of shown matches */}
                      <span className="matched-text">Matched {filterCategory}: </span>
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
    </main>
  );
}
export default React.memo(Table);
