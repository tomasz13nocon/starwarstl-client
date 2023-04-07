import React from "react";
import { Virtuoso } from "react-virtuoso";
import { _ } from "lodash";
import Ellipsis from "@components/ellipsis";
import MessageImg from "@components/messageImg";
import SortingIcon from "@components/sortingIcon";
import Error from "@components/error";
import { escapeRegex, searchFields, notSortable, columnNames, testArrayOrValue } from "@/util";
import Row from "./row";
import "./styles/timeline.scss";
import {
  Filterer,
  createFieldStrategy,
  createRangeStrategy,
  createTextStrategy,
  createTypeStrategy,
} from "./filtering";

function Table({
  filterText,
  typeFilters,
  rawData,
  boxFilters,
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
      strategies.push(createFieldStrategy(boxFilters));
    }

    if (filterText) {
      strategies.push(createTextStrategy(filterText));
    }

    const filterer = new Filterer(rawData, strategies);
    let tempData = filterer.filter();

    // Sort
    if (sorting.by === "chronology") {
      // Remove items with unknown placement, the ones from the other table
      // TODO: maybe notify user that some items have been hidden?
      tempData = tempData.filter((item) => item.chronology != null);
    }
    tempData = tempData.sort((a, b) => {
      let by = sorting.by;
      if (by === "date") by = "chronology";
      let av = a[by],
        bv = b[by];
      // TODO: micro optimization: make seperate sorting functions based on value of "by" instead of checking it per item
      if (by === "releaseDate") {
        // Unknown release date always means unreleased, therefore the newest
        // == is intended (null or undefined)
        if (av == null) return sorting.ascending ? 1 : -1;
        if (bv == null) return sorting.ascending ? -1 : 1;
        if (a.releaseDateEffective) av = a.releaseDateEffective;
        if (b.releaseDateEffective) bv = b.releaseDateEffective;
      }
      if (av < bv) return sorting.ascending ? -1 : 1;
      if (av > bv) return sorting.ascending ? 1 : -1;
      return 0;
    });

    // Collapse adjacent entries
    if (collapseAdjacent && tempData.length > 2) {
      let next,
        first = null,
        match;
      const tvEpsRe = /^(\d+)(?:[–-](\d+))?$/;
      const comicRe = /^(.*?)(\d+)$/;

      tempData = tempData.filter((item, i, arr) => {
        next = arr[i + 1];
        // Remove data from previous render
        delete item.collapseUntil;
        delete item.collapsedCount;

        if (
          (item.type === "tv" &&
            next?.type === "tv" &&
            item.series?.length &&
            next.series?.length &&
            next.series[0] === item.series[0] &&
            // next?.series?.length === item.series.length &&
            // next.series.every((el) => item.series.includes(el)) &&
            next.season === item.season &&
            (match = item.episode?.match(tvEpsRe)) &&
            +(match[2] ?? match[1]) + 1 === +next.episode?.match(tvEpsRe)[1]) ||
          // pls don't ask about this code. it works. trust me.
          (item.fullType === "comic" &&
            next?.fullType === "comic" &&
            item.title.match(comicRe)?.[1] === next.title.match(comicRe)?.[1] &&
            +item.title.match(comicRe)?.[2] + 1 === +next.title.match(comicRe)?.[2])
        ) {
          if (first === null) {
            first = i;
            return true;
          }
          return false;
        } else if (first !== null) {
          // Don't collapse just 2 entries
          if (first !== i - 1) {
            arr[first].collapseUntil = item;
            arr[first].collapseUntilTitle = item.title; // We need this specifically for search
            arr[first].collapseUntilSe = item.se; // We need this specifically for search
            // arr[first].collapsedCount = i - first;
            first = null;
            return false;
          }
          first = null;
        }
        return true;
      });
    }

    tempData.incomplete = rawData.incomplete;
    return tempData;
  }, [
    rawData,
    typeFilters,
    filterText,
    sorting,
    boxFilters,
    hideUnreleased,
    hideAdaptations,
    collapseAdjacent,
    rangeFrom,
    rangeTo,
    timelineRangeBy,
  ]);

  // Scroll to expanded entry on data change.
  // This effect needs to have the same deps as useMemo above.
  React.useEffect(() => {
    if (expanded) {
      let index = data.findIndex((e) => e._id === expanded);
      if (index !== -1) {
        virtuoso.current.scrollToIndex({
          index: index,
          align: "center",
          // behavior: behavior,
          // offset: -100,
        });
      }
    }
  }, [
    rawData,
    typeFilters,
    filterText,
    sorting,
    boxFilters,
    hideUnreleased,
    hideAdaptations,
    collapseAdjacent,
    rangeFrom,
    rangeTo,
    timelineRangeBy,
  ]);

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
        {dataState === "fetching" && (
          <MessageImg img="jediTexts">
            Accessing sacred Jedi texts
            <Ellipsis />
          </MessageImg>
        )}
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
              let searchResultRowIndex;
              do {
                rowResultCount++;
              } while (
                (searchResultRowIndex =
                  searchResults.results[resultsIndex + rowResultCount]?.rowIndex) === index
              );
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
                />
              </div>
            );
          }}
        />
      </div>
    </div>
  );
}
export default React.memo(Table);
