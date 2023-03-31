import React from "react";
import { Icon } from "@mdi/react";
import {
  mdiSortAlphabeticalAscending,
  mdiSortAlphabeticalDescending,
  mdiChevronUp,
  mdiChevronDown,
  mdiSortCalendarAscending,
  mdiSortCalendarDescending,
} from "@mdi/js";


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

export default function SortingIcon({ sorting, name }) {
  return (
    <>
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
    </>
  );
}
