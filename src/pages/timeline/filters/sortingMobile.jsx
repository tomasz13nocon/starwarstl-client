import SortingIcon from "@components/sortingIcon";
import { columnNames, notSortable } from "@/util";
import FiltersSection from "./filtersSection";
import c from "./styles/sortingMobile.module.scss";
import clsx from "clsx";

export default function SortingMobile({ columns, sorting, toggleSorting }) {
  return (
    <div className={c.sortingMobile}>
      <FiltersSection title="Sort by">
        <div className={c.sortingBtns}>
          {/* <div className={c.sortByText}>Sort by:</div> */}
          {Object.keys(columns)
            .filter((c) => !notSortable.includes(c))
            .map((column) => (
              <button
                className={clsx(c.sortingBtn, sorting.by === column && c.active)}
                key={column}
                onClick={() => toggleSorting(column)}
              >
                <span>{columnNames[column]}</span>
                <SortingIcon sorting={sorting} name={column} className={c.icon} />
              </button>
            ))}
        </div>
      </FiltersSection>
    </div>
  );
}
