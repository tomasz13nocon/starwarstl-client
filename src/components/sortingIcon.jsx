import {
  mdiSortAlphabeticalAscending,
  mdiSortAlphabeticalDescending,
  mdiChevronUp,
  mdiChevronDown,
  mdiSortCalendarAscending,
  mdiSortCalendarDescending,
} from "@mdi/js";
import Icon from "./icon";

import c from "./styles/sortingIcon.module.scss";
import clsx from "clsx";

const sortingIcons = new Proxy(
  {
    title: {
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
      for (const k in target) if (new RegExp(k).test(property)) return target[k];
      return target.default;
    },
  },
);

export default function SortingIcon({ sorting, name, className }) {
  return (
    <>
      {sorting.by === name ? (
        <Icon
          className={clsx(c.sortingIcon, className)}
          path={sortingIcons[name][sorting.ascending ? "ascending" : "descending"]}
        />
      ) : null}
    </>
  );
}
