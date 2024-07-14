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
  },
);

export default function SortingIcon({ sorting, name }) {
  return (
    <>
      {sorting.by === name ? (
        <Icon
          className={c.sortingIcon}
          path={sortingIcons[name][sorting.ascending ? "ascending" : "descending"]}
        />
      ) : null}
    </>
  );
}
