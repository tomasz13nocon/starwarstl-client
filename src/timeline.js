import React from "react";
import { useVirtual, useVirtualWindow } from "react-virtual";
import { useWindowVirtualizer } from "@tanstack/react-virtual";
import ItemMeasurer from "./ItemMeasurer.js";
import _ from "lodash";
import Icon from "@mdi/react";
import useDeepCompareEffect from "use-deep-compare-effect";
import {
  mdiSortAlphabeticalAscending,
  mdiSortAlphabeticalDescending,
  mdiChevronUp,
  mdiChevronDown,
  mdiMenuDown,
  mdiSortCalendarAscending,
  mdiSortCalendarDescending,
} from "@mdi/js";

import TimelineRow from "./timelineRow.js";
import "./styles/timeline.scss";
import { unscuffDate } from "./common.js";
import md5 from "md5";

const sortingIcons = new Proxy(
  {
    "title|writer": {
      ascending: mdiSortAlphabeticalAscending,
      descending: mdiSortAlphabeticalDescending,
    },
    "releaseDate|date": {
      ascending: mdiSortCalendarAscending,
      descending: mdiSortCalendarDescending,
    },
    default: {
      ascending: mdiChevronDown,
      descending: mdiChevronUp,
    },
  },
  {
    get: (target, property) => {
      for (let k in target) if (new RegExp(k).test(property)) return target[k];
      return target.default;
    },
  }
);

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
    if (item[key] === undefined)
      return value["Other"] ?? value["Unknown"] ?? false;
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
  searchText,
  filters,
  rawData,
  seriesArr,
  setSuggestions,
  boxFilters,
  searchExpanded,
  ...props
}) {
  ///// STATE /////
  // State representing shown columns.
  // Keys: names of columns corresponding to keys in data
  // Values: wheter they're to be displayed
  const [columns, setColumns] = React.useState({
    date: true,
    cover: false,
    continuity: false, // TODO: width of page, responsive, etc. AND oneshots AND only show when comics filtered AND background color of rows
    title: true,
    writer: true,
    releaseDate: true,
  });
  const [sorting, setSorting] = React.useState({
    by: "date",
    ascending: true,
  });
  const [data, setData] = React.useState([]);
  const [expanded, setExpanded] = React.useState();
  // return window.getSelection().type === "Range" ? state : !state;
  /////////////////

  const columnNames = React.useMemo(
    () => ({
      date: "Date",
      continuity: "Continuity",
      cover: "Cover",
      title: "Title",
      writer: "Writer",
      releaseDate: "Release Date",
    }),
    []
  );
  const activeColumns = React.useMemo(
    () => Object.keys(columns).filter((name) => columns[name]),
    [columns]
  );

  const toggleSorting = React.useCallback(
    (name) => {
      setSorting((prevSorting) => ({
        by: name,
        ascending: prevSorting.by === name ? !prevSorting.ascending : true,
      }));
    },
    [setSorting]
  );

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

  // Sort and filter data
  useDeepCompareEffect(() => {
    let tempData = [];
    // Filter
    let cleanFilters = _.cloneDeep(filters);
    removeAllFalses(cleanFilters);
    tempData = rawData.filter((item) => filterItem(cleanFilters, item));

    // Search
    if (filterText || boxFilters.length) {
      // const re = /"([^"]*?)"/g;
      // let exact = Array.from(filterText.toLowerCase().matchAll(re));
      // let queries = filterText.replace(re, "").split(";");
      let queries = filterText.toLowerCase().split(";");

      // Search suggestions
      let last = queries[queries.length - 1].trim();
      if (last.length >= 2) {
        let found = seriesArr.filter((item) =>
          item.displayTitle
            ? item.displayTitle.toLowerCase().includes(last)
            : item.title.toLowerCase().includes(last)
        );
        if (found.length) {
          setSuggestions(
            found
              .filter((el) => !boxFilters.includes(el))
              .sort((a, b) => {
                let ap = suggestionPriority.indexOf(a.fullType || a.type),
                  bp = suggestionPriority.indexOf(b.fullType || b.type);
                if (ap > bp) return 1;
                if (ap < bp) return -1;
                return 0;
              })
              .slice(0, 10)
          );
        } else setSuggestions([]);
      } else setSuggestions([]);

      if (boxFilters.length) {
        tempData = tempData.filter((item) => {
          for (let boxFilter of boxFilters) {
            if (
              item.series &&
              item.series.includes(boxFilter.title) /* && item.*/ // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<,
            ) {
              //TODO: We want more than series????
              return true;
            }
          }
        });
      }

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
    } else {
      setSuggestions([]);
    }

    // Sort
    if (sorting.by === "chronology")
      // Remove items with unknown placement, the ones from the other table
      // TODO: maybe notify user that some items have been hidden?
      tempData = tempData.filter((item) => item.chronology != null);
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
              item.ongoingContinuity = _.cloneDeep(ongoingContinuity);
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

    setData(tempData);
  }, [filters, filterText, sorting, boxFilters]);

  const [animating, setAnimating] = React.useState(0); // integer, to account for simultaneous amnimations

  const parentRef = React.useRef();
  const windowRef = React.useRef(window);

  const rowCache = React.useRef();
  const rowVirtualizer = useWindowVirtualizer({
    overscan: 5,
    enableSmoothScroll: false,
    count: data.length,
    estimateSize: (i) => 29, // 64, 29
    // parentRef,
    // windowRef,
    getItemKey: React.useCallback((i) => data[i]._id, [data]),
    getScrollElement: () => window,
    rangeExtractor: React.useCallback(
      ({ startIndex, endIndex, overscan, count }) => {
        // When row expansion animation is in progress, don't recalculate rows to render
        // Is this useless optimization?
        // if (animating !== 0) return rowCache.current;
        const a = Math.max(startIndex - overscan, 0);
        const b = Math.min(endIndex + overscan, count - 1);
        const arr = [];
        for (let i = a; i <= b; i++) {
          arr.push(i);
        }
        // always render expanded row to avoid rows moving abruptly when that row comes back into view
        if (expanded) {
          let index = data.findIndex((v) => v._id === expanded);
          if (!arr.includes(index)) arr.push(index);
        }
        rowCache.current = arr;
        return arr;
      },
      [rowCache, animating]
    ),
  });

  React.useEffect(() => {
    const searchFields = [ "title", "writer", "releaseDate", "date" ];
    if (searchText) {
      let firstMatch = data.findIndex(e => {
        return searchFields.some(field => {
          if (typeof e[field] === "string")
            return e[field].toLowerCase().includes(searchText.toLowerCase());
          else if (Array.isArray(e[field]))
            return e[field].some(f => f.toLowerCase().includes(searchText.toLowerCase()));
          else
            console.error("unknown field type");
        });
      });
      if (firstMatch !== -1) {
        rowVirtualizer.scrollToIndex(Math.max(0, firstMatch), { align: "start" });
      }
    }
  }, [searchText]);

  return (
    <div className="container table">
      <div className="thead">
        {activeColumns.map((name) => (
          <div
            onClick={(e) => toggleSorting(name, e)}
            key={name}
            className={name + " th"}
          >
            <div className="th-inner">
              {columnNames[name] || name}
              {sorting.by === name ? (
                <Icon
                  path={
                    sortingIcons[name][
                      sorting.ascending ? "ascending" : "descending"
                    ]
                  }
                  className="icon"
                />
              ) : null}
            </div>
          </div>
        ))}
      </div>
      <div ref={parentRef} className="tbody">
        <div
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`,
            // width: '100%',
            position: "relative",
          }}
        >
          {rowVirtualizer.getVirtualItems().map((virtualRow) => {
            let item = data[virtualRow.index];
            if (item === undefined) {
              console.log(
                "item undefined!",
                rowVirtualizer.virtualItems,
                virtualRow,
                virtualRow.index,
                data
              );
              return null;
            }
            return (
              <div
                key={virtualRow.key}
                ref={virtualRow.measureElement}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: '100%',
                  transform: `translateY(${virtualRow.start}px)`,
                }}
                className="tr-outer"
              >
                <TimelineRow
                  item={item}
                  activeColumns={activeColumns}
                  setAnimating={setAnimating}
                  expanded={expanded === item._id}
                  setExpanded={setExpanded}
                  seriesArr={seriesArr}
                  searchText={searchText}
                  searchExpanded={searchExpanded}
                  measure={rowVirtualizer.measure}
                  {...props}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
