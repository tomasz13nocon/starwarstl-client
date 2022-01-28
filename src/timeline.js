import React from "react";
import Icon from "@mdi/react";
import {
  mdiSortAlphabeticalAscending,
  mdiSortAlphabeticalDescending,
  mdiChevronUp,
  mdiChevronDown,
  mdiMenuUp,
  mdiMenuDown,
  mdiSortCalendarAscending,
  mdiSortCalendarDescending,
} from "@mdi/js";

import TimelineRow from "./timelineRow.js";
import "./styles/timeline.scss";

const filterItem = (filters, item) => {
  console.log(filters, item);
  // TODO remove or handle
  if (filters === undefined)
    console.error(
      "This probably means a value from data not being present in filters (like type === 'whatever')"
    );

  return Object.entries(filters).reduce((acc, [key, value]) => {
    // boolean key in data
    if (typeof value === "boolean") {
      // equivalent: item[key] ? value : true;
      return acc && (!item[key] || value);
    }
    // string key in data
    else {
      // leaf filter
      // TODO handle "Other" and "Unknown". This is related to the todo above. This for leafs, above for non leafs
      /*if (!(item[key] in value)) {
				return value["Other"];
			}
			else*/
      if (typeof value[item[key]] === "boolean") {
        return acc && value[item[key]];
      }
      // Non leaf filter
      else {
        console.log(`KEY: ${key}`);
        return acc && filterItem(value[item[key]], item);
      }
    }
  }, true);
};

export default function Timeline({ filterText, filters, rawData }) {
  ///// STATE /////
  // TODO change default when switching to a backend API
  const [dataLoaded, setDataLoaded] = React.useState(true);
  // State representing shown columns.
  // Keys: names of columns corresponding to keys in data
  // Values: wheter they're to be displayed
  const [columns, setColumns] = React.useState({
    date: true,
    type: false,
    cover: false,
    title: true,
    author: true,
    releaseDate: true,
  });
  const [sorting, setSorting] = React.useState({ by: "date", ascending: true });
  const reducer = (state, action) => {};
  const [expandedRow, dispatch] = React.useReducer(reducer);
  /////////////////

  const activeColumns = Object.keys(columns).filter((name) => columns[name]);

  const toggleSorting = (name) => {
    setSorting((prevSorting) => ({
      by: name,
      ascending: prevSorting.by === name ? !prevSorting.ascending : true,
    }));
  };

  // Sort and filter data
  let data = [...rawData];
  if (dataLoaded) {
    // Filter
    data = data.filter((item) => filterItem(filters, item));

    // Search
    if (filterText) {
      // Filter data to include items, where ALL words in filterText are included in either title OR author
      // Words seperated by space
      data = data.filter((item) =>
        filterText
          .toLowerCase()
          .split(" ")
          .reduce(
            (acc, value) =>
              acc &&
              (item.title.toLowerCase().includes(value) ||
                item.author?.toLowerCase().includes(value)),
            true
          )
      );
    }

    // Sort
    data.sort((a, b) => {
      if (a[sorting.by] < b[sorting.by]) return sorting.ascending ? -1 : 1;
      if (a[sorting.by] > b[sorting.by]) return sorting.ascending ? 1 : -1;
      return 0;
    });
  }

  // TODO move somewhere like useeffect
  const sortingIcons = new Proxy(
    {
      "title|author": {
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
        for (let k in target)
          if (new RegExp(k).test(property)) return target[k];
        return target.default;
      },
    }
  );

  return (
    <div className="container">
      {dataLoaded ? (
        <table id="timeline">
          <thead>
            <tr>
              {activeColumns.map((name) => (
                <th
                  onClick={(e) => toggleSorting(name, e)}
                  key={name}
                  className={name}
                >
                  {name}
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
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <TimelineRow
                key={item.id}
                item={item}
                activeColumns={activeColumns}
                expanded={expandedRow === item.id}
              />
            ))}
          </tbody>
        </table>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
}
