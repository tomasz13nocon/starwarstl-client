import React from "react";
import { Virtuoso } from "react-virtuoso";
import { _ } from "lodash";
import Ellipsis from "@components/ellipsis";
import MessageImg from "@components/messageImg";
import SortingIcon from "@components/sortingIcon";
import Error from "@components/error";
import { escapeRegex, searchFields, notSortable, columnNames } from "@/util";
import TimelineRow from "./timelineRow";
import "./styles/timeline.scss";

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
  return Array.isArray(value) ? value.some((v) => predicate(v)) : predicate(value);
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
    // TODO what is this? // TODO from future: why is this a todo????
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

function Table({
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
        // offset: -100,
      });
    }
  }, [searchResults.highlight]);

  // Sort and filter data
  const data = React.useMemo(() => {
    if (rawData.length === 0) return [];
    let tempData = [...rawData];

    // Timeline range
    // by date, by releasedate
    // from, to
    // year, title
    // bby aby

    // dateFromYear // sort by chronology > iterate until first item with date not older than rangeFromYear
    // dateToYear // Same (diff comparison operator)
    // dateFromTitle // find item by title > get chronology
    // dateToTitle // Same exactly
    // releaseDateFromYear // sort by releaseDate > find first item with matching release date > remove everything prior
    // releaseDateToYear // Same (remove everything after)
    // releaseDateFromTitle // Same (matching title)
    // releaseDateToTitle // Same (remove everything after)

    let frankensteinFunctions = {
      dateFromYearToYear: (data, from, to) => {
        // let lowest = Number.MAX_SAFE_INTEGER, highest = Number.MIN_SAFE_INTEGER;
        // for (let i = 0; i < data.length; i++) {
        //   // console.log(data[i].chronology, lowest, (data[i].dateParsed?.date2 ?? data[i].dateParsed?.date1), from);
        //   if (data[i].chronology < lowest && (data[i].dateParsed?.date2 ?? data[i].dateParsed?.date1) >= from) {
        //     lowest = data[i].chronology;
        //     console.log(data[i].title, data[i].date);
        //   }
        //   if (data[i].chronology > highest && data[i].dateParsed?.date1 <= to) {
        //     highest = data[i].chronology;
        //     console.log(data[i].title, data[i].date);
        //   }
        // }
        // let filterFn = (item) => item.chronology >= lowest && item.chronology <= highest;
        // if (from === undefined) filterFn = (item) => item.chronology <= highest;
        // if (to === undefined) filterFn = (item) => item.chronology >= lowest;

        // Plug the dynamicly chosen function into these condition
        // let filterFn = (date) => (date.date2 ?? date.date1) >= from && date.date1 <= to;
        // if (from === undefined) filterFn = (date) => date.date1 <= to;
        // if (to === undefined) filterFn = (date) => (date.date2 ?? date.date1) >= from;
        if (from > to) return [];
        return data.filter((item) =>
          item.dateParsed?.some((date) => (date.date2 ?? date.date1) >= from && date.date1 <= to)
        );
      },
      dateFromYear: (data, from, to) => {
        return data.filter((item) =>
          item.dateParsed?.some((date) => (date.date2 ?? date.date1) >= from)
        );
      },
      dateToYear: (data, from, to) => {
        return data.filter((item) => item.dateParsed?.some((date) => date.date1 <= to));
      },
      dateFromTitleToTitle: (data, from, to) => {
        return data.filter((item) => item.chronology >= from && item.chronology <= to);
      },
      dateFromTitle: (data, from, to) => {
        // TODO check for title's existance here, not Home, also exctract useMemo in a *smart* way
        return data.filter((item) => item.chronology >= from);
      },
      dateToTitle: (data, from, to) => {
        return data.filter((item) => item.chronology <= to);
      },
      dateFromYearToTitle: (data, from, to, dates) => {
        let titleDate = dates.reduce(
          (acc, v) => Math.max(acc, v.date2 ?? v.date1),
          Number.MIN_SAFE_INTEGER
        );
        return data.filter(
          (item) =>
            item.dateParsed?.some(
              (date) => (date.date2 ?? date.date1) >= from && date.date1 <= titleDate
            ) && item.chronology <= to
        );
      },
      dateFromTitleToYear: (data, from, to, dates) => {
        let titleDate = dates.reduce((acc, v) => Math.min(acc, v.date1), Number.MAX_SAFE_INTEGER);
        return data.filter(
          (item) =>
            item.chronology >= from &&
            item.dateParsed?.some(
              (date) => (date.date2 ?? date.date1) >= titleDate && date.date1 <= to
            )
        );
      },

      releaseDateFromYearToYear: (data, from, to) => {
        return data.filter((item) => {
          let rd = new Date(item.releaseDate);
          return rd >= from && rd <= to;
        });
      },
      releaseDateFromYear: (data, from, to) => {
        return data.filter((item) => new Date(item.releaseDate) >= from);
      },
      releaseDateToYear: (data, from, to) => {
        return data.filter((item) => new Date(item.releaseDate) <= to);
      },
      releaseDateFromTitleToTitle: (data, from, to) => {
        return data.filter((item) => {
          let rd = new Date(item.releaseDate);
          return rd >= from && rd <= to;
        });
      },
      releaseDateFromTitle: (data, from, to) => {
        return data.filter((item) => new Date(item.releaseDate) >= from);
      },
      releaseDateToTitle: (data, from, to) => {
        return data.filter((item) => new Date(item.releaseDate) <= to);
      },
      releaseDateFromYearToTitle: (data, from, to) => {
        return data.filter((item) => {
          let rd = new Date(item.releaseDate);
          return rd >= from && rd <= to;
        });
      },
      releaseDateFromTitleToYear: (data, from, to) => {
        return data.filter((item) => {
          let rd = new Date(item.releaseDate);
          return rd >= from && rd <= to;
        });
      },
    };

    // We use frankenstein string to avoid something even worse: 4 layers of nested ifs
    let frankenstein = timelineRangeBy;
    if (rangeFrom) frankenstein += "From" + (rangeFrom.isTitle ? "Title" : "Year");
    if (rangeTo) frankenstein += "To" + (rangeTo.isTitle ? "Title" : "Year");

    if (rangeFrom || rangeTo) {
      tempData = frankensteinFunctions[frankenstein](
        tempData,
        rangeFrom?.value,
        rangeTo?.value,
        rangeFrom?.dates ?? rangeTo?.dates
      );
    }

    // Filter
    let cleanFilters = _.cloneDeep(filters);
    removeAllFalses(cleanFilters);
    tempData = tempData.filter((item) => {
      if (hideUnreleased && item.unreleased) return false;
      if (hideAdaptations && item.adaptation) return false;
      return filterItem(cleanFilters, item);
    });

    // Box filters (filters applied when clicked on search suggestions)
    if (boxFilters.length) {
      if (boxFilters.length) {
        tempData = tempData.filter((item) => {
          for (let boxFilter of boxFilters) {
            if (item.series && item.series.includes(boxFilter.title) /* && item.*/) {
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
          : r;
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
    filters,
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
    filters,
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
          // if (item.title === "The High Republic — The Blade 1") console.log(item);
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
            {/* <div className="loading-indicator-table"></div> */}
            Accessing sacred Jedi texts
            <Ellipsis />
          </MessageImg>
        )}
        {dataState === "error" && <Error />}
        {dataState === "ok" && data.length === 0 && (
          <MessageImg img="void">
            There&quot;s nothing here...
            <br />
            <span className="small">(Try changing the filters or the query)</span>
          </MessageImg>
        )}
        <Virtuoso
          // style={{ position: "relative" }}
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
              <div
                style={
                  {
                    // position: "absolute",
                    // top: 0,
                    // left: 0,
                    // width: "100%",
                    // transform: `translateY(${virtualRow.start}px)`,
                  }
                }
                className="tr-outer"
              >
                <TimelineRow
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
