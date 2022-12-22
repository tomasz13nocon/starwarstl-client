import React from "react";
import { Virtuoso } from 'react-virtuoso';
import { _ } from "lodash";

import TimelineRow from "./timelineRow";
import "./styles/timeline.scss";
import { unscuffDate, escapeRegex, searchFields, notSortable, columnNames } from "./common";
import Ellipsis from "./ellipsis";
import MessageImg from "./messageImg";
import SortingIcon from "./sortingIcon";


const colorValues = [
  "#FFBE0B",
  // "#FB5607",
  "#3A86FF",
  "#d62828",
  "#8338EC",
  // "#FF006E",
  "#00f5d4",
  // "#8ac926",
  "#70e000",
  "#000000",
  "#774936",
];

const colorPrefs = [
  {
    regex: /\bmaul\b/i,
    color: "#d62828",
  },
  {
    regex: /\bdarth vader\b/i,
    color: "#000000",
  },
];

// Returns result of predicate with value as argument.
// If value is an array call it for every array item, until true is returned.
const testArrayOrOther = (value, predicate) => {
  return Array.isArray(value)
    ? value.some((v) => predicate(v))
    : predicate(value);
};

// TODO rework this entire thing (filters in general)
// I made them to work at infinite depth but that doesnt make sense
// all filters should be max 2 depth
const filterItem = (filters, item) => {
  if (filters === undefined) {
    return false;
  }

  return Object.entries(filters).reduce((acc, [key, value]) => {
    if (item[key] === undefined) {
      return value["Other"] ?? value["Unknown"] ?? false;
    }
    // boolean key in data
    // TODO what is this?
    if (typeof value === "boolean") {
      // equivalent: item[key] ? value : true;
      return acc && (!item[key] || value);
    }
    // string key in data
    else {
      if (
        // Array.isArray(item[key])
        //   ? !item[key].some((v) => v in value)
        //   : !(item[key] in value)
        !testArrayOrOther(item[key], (v) => v in value)
      ) {
        return acc && (value["Other"] || value["Unknown"]);
      }
      // leaf filter
      else if (
        // typeof value[item[key]] === "boolean"
        testArrayOrOther(item[key], (v) => typeof value[v] === "boolean")
      ) {
        // return acc && value[item[key]];
        return acc && testArrayOrOther(item[key], (v) => value[v]);
      }
      // Non leaf filter
      else {
        // return acc && filterItem(value[item[key]], item);
        return acc && filterItem(value[item[key]], item);
      }
    }
  }, true);
};

// remove sibling values that all equate to false, to mimic shopping websites filters, that treat subgroups of unchecked filters as checked
const removeAllFalses = (filters) => {
  let acc = false;
  for (let [key, value] of Object.entries(filters)) {
    if (typeof value === "boolean") {
      acc ||= value;
    } else {
      let childrenChecked = removeAllFalses(value);
      if (!childrenChecked) delete filters[key];
      acc ||= childrenChecked;
    }
  }
  return acc;
};


export default function Timeline({
  filterText,
  filters,
  rawData,
  seriesArr,
  setSuggestions,
  boxFilters,
  searchExpanded,
  searchResults,
  dispatchSearchResults,
  hideUnreleased,
  setHideUnreleased,
  collapseAdjacent,
  columns,
  dataState,
  sorting,
  toggleSorting,
  ...props
}) {
  ///// STATE /////
  // const [data, setData] = React.useState([]);
  const [expanded, setExpanded] = React.useState(null);
  // return window.getSelection().type === "Range" ? state : !state;
  /////////////////

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
      if (highlightIndex >= renderedRange.current.startIndex &&
        highlightIndex <= renderedRange.current.endIndex) {
        behavior = "smooth";
      }
      virtuoso.current.scrollToIndex({
        index: highlightIndex,
        align: "center",
        behavior: behavior,
        // offset: -100,
      });
    }
  }, [searchResults.highlight]);

  // Sort and filter data
  const data = React.useMemo(() => {
    if (rawData.length === 0) return [];
    let tempData = [];

    // Filter
    let cleanFilters = _.cloneDeep(filters);
    removeAllFalses(cleanFilters);
    tempData = rawData.filter((item) => {
      if (hideUnreleased && item.unreleased)
        return false;
      return filterItem(cleanFilters, item);
    });

    // Box filters (filters applied when clicked on search suggestions)
    if (boxFilters.length) {
      if (boxFilters.length) {
        tempData = tempData.filter((item) => {
          for (let boxFilter of boxFilters) {
            if (
              item.series &&
              item.series.includes(boxFilter.title) /* && item.*/
            ) {
              //TODO: We want more than series????
              return true;
            }
          }
        });
      }
    }

    // Search (filter by text)
    if (filterText) {
      // const re = /"([^"]*?)"/g;
      // let exact = Array.from(filterText.toLowerCase().matchAll(re));
      // let queries = filterText.replace(re, "").split(";");
      // let queries = filterText.toLowerCase().split(";");
      let queries = [filterText.toLowerCase()];
      tempData = tempData.filter((item) => {
        let r = queries.map((v) => v.trim()).filter((v) => v);
        return r.length
          ? r.some((query) =>
            query
            .split(" ")
            .reduce(
              (acc, value) =>
              acc &&
              (item.title.toLowerCase().includes(value) ||
                item.writer?.reduce(
                  (acc, v) => acc || v?.toLowerCase().includes(value),
                  false
                ) ||
                item.series?.reduce(
                  (acc, v) => acc || v?.toLowerCase().includes(value),
                  false
                )),
              true
            )
          )
          : r; // TODO: This returns empty arr which is truthy. Test this.
      });
    }

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
        av = unscuffDate(av);
        bv = unscuffDate(bv);
      }
      if (av < bv) return sorting.ascending ? -1 : 1;
      if (av > bv) return sorting.ascending ? 1 : -1;
      return 0;
    });

    // Collapse adjacent entries
    if (collapseAdjacent && tempData.length > 2) {
      let next, first = null, match;
      const tvEpsRe = /^(\d+)(?:[–-](\d+))?$/;
      const comicRe = /^(.*?)(\d+)$/;

      tempData = tempData.filter((item, i, arr) => {
        next = arr[i+1];
        // Remove data from previous render
        delete item.collapseUntil;
        delete item.collapsedCount;

        if (
          ( item.type === "tv" &&
            next?.type === "tv" &&
            item.series?.length &&
            next.series?.length &&
            next.series[0] === item.series[0] &&
            // next?.series?.length === item.series.length &&
            // next.series.every((el) => item.series.includes(el)) &&
            next.season === item.season &&
            (match = item.episode?.match(tvEpsRe)) &&
            +(match[2] ?? match[1]) + 1 === +(next.episode?.match(tvEpsRe)[1])
            // pls don't ask about this code. it works. trust me.
          ) ||
          ( item.fullType === "comic" &&
            next?.fullType === "comic" &&
            item.title.match(comicRe)?.[1] === next.title.match(comicRe)?.[1] &&
            +(item.title.match(comicRe)?.[2]) + 1 === +(next.title.match(comicRe)?.[2])
          )
        ) {
          if (first === null) {
            first = i;
            return true;
          }
          return false;
        }
        else if (first !== null) {
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

    // Figure out last entry in each comic series to know when to close the continuity line.
    if (activeColumns.includes("continuity")) {
      let lastsInSeries = {},
        positions = {},
        colors = {};
      for (let item of tempData) {
        if (item.fullType === "comic" && item.series?.length) {
          for (let series of item.series) {
            if (seriesArr.find((e) => e.title === series).type === "comic") {
              lastsInSeries[series] = item.title;
            }
          }
        }
      }

      let ongoingContinuity = {};
      for (let item of tempData) {
        if (item.fullType === "comic" && item.series?.length) {
          for (let series of item.series) {
            if (seriesArr.find((e) => e.title === series).type === "comic") {
              let whichInSeries, currentContinuity;
              if (positions[series] === undefined) {
                let i = -1;
                while (true) if (!Object.values(positions).includes(++i)) break;
                positions[series] = i;
                let color, hash, startHash, tempColor;
                if (
                  colorPrefs.some(
                    (e) =>
                    e.regex.test(series) &&
                    !Object.values(colors).includes((tempColor = e.color))
                  )
                ) {
                  color = tempColor;
                } else {
                  hash = item.wookieepediaId % colorValues.length;
                  color = colorValues[hash];
                  startHash = hash; // prevent inf loop
                  while (Object.values(colors).includes(color)) {
                    if (item.title === "Kanan 1")
                      console.log(colorValues.length, hash, startHash);
                    color =
                      colorValues[
                        hash === colorValues.length - 1 ? (hash = 0) : ++hash
                      ];
                    if (hash === startHash) {
                      console.warn("collision loop " + item.title);
                      break;
                    }
                  }
                }
                colors[series] = color;
                whichInSeries = "first";
              }
              currentContinuity = {
                color: colors[series],
                position: positions[series],
              };
              if (lastsInSeries[series] === item.title) {
                delete positions[series];
                delete colors[series];
                if (whichInSeries === "first") whichInSeries = "oneshot";
                else whichInSeries = "last";
              }
              if (whichInSeries === undefined) whichInSeries = "middle";

              currentContinuity.whichInSeries = whichInSeries;
              ongoingContinuity[series] = currentContinuity;
              item.ongoingContinuity = _.cloneDeep(ongoingContinuity); // assigning to item. Is this okay? This affects rawData.
              if (lastsInSeries[series] === item.title)
                delete ongoingContinuity[series];
              if (whichInSeries === "first")
                ongoingContinuity[series].whichInSeries = "middle";
            }
          }
        }
        // if (!item.ongoingContinuity) {
        //   item.ongoingContinuity = _.cloneDeep(ongoingContinuity);
        // }
      }
    }

    tempData.incomplete = rawData.incomplete;
    return tempData;
  }, [rawData, filters, filterText, sorting, boxFilters, hideUnreleased, collapseAdjacent]);

  // Scroll to expanded entry on data change.
  // This effect needs to have the same deps as useMemo above.
  React.useEffect(() => {
    if (expanded) {
      virtuoso.current.scrollToIndex({
        index: data.findIndex((e) => e._id === expanded),
        align: "center",
        // behavior: behavior,
        // offset: -100,
      });
    }
  }, [filters, filterText, sorting, boxFilters, hideUnreleased, collapseAdjacent]);

  // Search (Ctrl-F replacement)
  React.useEffect(() => {
    const findAllIndices = (str, searchText) =>
      [...str.matchAll(new RegExp(escapeRegex(searchText), "gi"))].map(
        (a) => a.index
      );
    if (searchExpanded) {
      let overallSize = 0;
      if (searchResults.text === "") {
        dispatchSearchResults({ type: "setResults", payload: { results: [], overallSize: overallSize } });
      } else {
        let results = [];
        for (let [rowIndex, item] of data.entries()) {
          if (item.title === "The High Republic — The Blade 1") console.log(item);
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
                  console.error(
                    "Unknown field type while searching (array of non strings)"
                  );
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

        dispatchSearchResults({ type: "setResults", payload: { results: results, overallSize: overallSize } });
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
        {dataState === "fetching" &&
          <MessageImg img="jediTexts">
            {/* <div className="loading-indicator-table"></div> */}
            Accessing sacred Jedi texts<Ellipsis />
          </MessageImg>
        }
        {dataState === "error" &&
          <MessageImg img="yoda">
            The dark side clouds everything.
            <br/>
            Impossible to see, the server is.
            <br/>
            <span className="small">(Error fetching data from the server)</span>
          </MessageImg>
        }
        {dataState === "ok" && data.length === 0 &&
          <MessageImg img="void">
            There's nothing here...
            <br/>
            <span className="small">(Try changing the filters or the query)</span>
          </MessageImg>
        }
        <Virtuoso
          // style={{ position: "relative" }}
          ref={virtuoso}
          useWindowScroll={true}
          overscan={200}
          data={data}
          rangeChanged={(range) => renderedRange.current = range}
          itemContent={(index, item) => {
            // The index in searchResults.results array of the first result in this row
            let resultsIndex = searchResults.results.findIndex(r => r.rowIndex === index);
            let rowResultCount = 0, rowSearchResults = [];

            // Get the search results in current row
            if (resultsIndex !== -1) {
              let searchResultRowIndex;
              do  {
                rowResultCount++;
              } while ((searchResultRowIndex = searchResults.results[resultsIndex + rowResultCount]?.rowIndex) === index);
              rowSearchResults = searchResults.results.slice(resultsIndex, resultsIndex + rowResultCount);
            }

            return (
              <div
                style={{
                  // position: "absolute",
                  // top: 0,
                  // left: 0,
                  // width: "100%",
                  // transform: `translateY(${virtualRow.start}px)`,
                }}
                className="tr-outer"
              >
                <TimelineRow
                  item={item}
                  activeColumns={activeColumns}
                  expanded={expanded === item._id}
                  setExpanded={setExpanded}
                  seriesArr={seriesArr}
                  searchExpanded={searchExpanded}
                  searchResultsHighlight={searchResults.highlight ?
                      {
                        resultsOffset: searchResults.highlight.resultsIndex - resultsIndex,
                          indicesIndex: searchResults.highlight.indicesIndex
                      } :
                      null}
                  rowSearchResults={rowSearchResults}
                  searchText={searchResults.text}
                  collapseAdjacent={collapseAdjacent}
                  dataState={dataState}
                  {...props}
                />
              </div>
            );
          }}
        />
      </div>
    </div>
  );
}
