import React from "react";
import { useVirtual, useVirtualWindow } from "react-virtual";
import ItemMeasurer from "./ItemMeasurer.js";
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

const filterItem = (filters, item) => {
  if (filters === undefined) {
    return false;
  }

  return Object.entries(filters).reduce((acc, [key, value]) => {
    if (item[key] === undefined)
      return value["Other"] ?? value["Unknown"] ?? acc;
    // boolean key in data
    if (typeof value === "boolean") {
      // equivalent: item[key] ? value : true;
      return acc && (!item[key] || value);
    }
    // string key in data
    else {
      if (!(item[key] in value)) {
        return acc && (value["Other"] || value["Unknown"]);
      }
      // leaf filter
      else if (typeof value[item[key]] === "boolean") {
        return acc && value[item[key]];
      }
      // Non leaf filter
      else {
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

export default function Timeline({ filterText, filters, rawData, ...props }) {
  ///// STATE /////
  // State representing shown columns.
  // Keys: names of columns corresponding to keys in data
  // Values: wheter they're to be displayed
  const [columns, setColumns] = React.useState({
    date: true,
    cover: false,
    series: false,
    title: true,
    writer: true,
    releaseDate: true,
  });
  const [sorting, setSorting] = React.useState({
    by: "date",
    ascending: true,
  });
  const [data, setData] = React.useState([]);
  /////////////////

  const columnNames = React.useMemo(
    () => ({
      date: "Date",
      series: "Series Continuity",
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

  // Sort and filter data
  useDeepCompareEffect(() => {
    let tempData = [];
    // Filter
    let cleanFilters = _.cloneDeep(filters);
    removeAllFalses(cleanFilters);
    tempData = rawData.filter((item) => filterItem(cleanFilters, item));

    // Search
    if (filterText) {
      // Filter data to include items, where ALL words in filterText are included in either title OR author
      // Words seperated by space
      tempData = tempData.filter((item) =>
        filterText
          .toLowerCase()
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
      );
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
    setData(tempData);
  }, [filters, filterText, sorting]);

  const [animating, setAnimating] = React.useState(0); // integer, to account for simultaneous amnimations

  const parentRef = React.useRef();
  const windowRef = React.useRef(window);

  const rowCache = React.useRef();
  const rowVirtualizer = useVirtualWindow({
    overscan: 5,
    size: data.length,
    parentRef,
    windowRef,
    keyExtractor: React.useCallback((i) => data[i]._id, [data]),
    // TODO: Is this useless optimization?
    rangeExtractor: React.useCallback(
      ({ start, end, overscan, size }) => {
        if (animating !== 0) return rowCache.current;
        const a = Math.max(start - overscan, 0);
        const b = Math.min(end + overscan + 10, size - 1);
        const arr = [];
        for (let i = a; i <= b; i++) {
          arr.push(i);
        }
        rowCache.current = arr;
        return arr;
      },
      [rowCache, animating]
    ),
    // estimateSize: React.useCallback(() => 24, []),
  });

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
            height: rowVirtualizer.totalSize,
            // width: '100%',
            position: "relative",
          }}
        >
          {rowVirtualizer.virtualItems.map((virtualRow) => (
            <ItemMeasurer
              key={data[virtualRow.index]._id}
              measure={virtualRow.measureRef}
              tagName="div"
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                // width: '100%',
                transform: `translateY(${virtualRow.start}px)`,
              }}
            >
              <TimelineRow
                item={data[virtualRow.index]}
                activeColumns={activeColumns}
                setAnimating={setAnimating}
                {...props}
              />
            </ItemMeasurer>
          ))}
        </div>
      </div>
    </div>
  );
}
