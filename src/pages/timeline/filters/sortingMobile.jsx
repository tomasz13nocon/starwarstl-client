import React from "react";
import FiltersSection from "./filtersSection";
import SortingIcon from "../../../components/sortingIcon";
import { columnNames, notSortable } from "../../../util";
import "./styles/sortingMobile.scss";

export default function SortingMobile({
  columns,
  sorting,
  toggleSorting,
}) {
  return (
    <div className="sorting-mobile">
      <FiltersSection title="Sort by">
        <div className="sorting-btns">
          {Object.keys(columns).filter(c => !notSortable.includes(c)).map((column) => (
            <div className={`sorting-btn ${sorting.by === column ? "active" : ""}`} key={column} onClick={(e) => toggleSorting(column)}>
              {columnNames[column]}
              <SortingIcon sorting={sorting} name={column} />
            </div>
          ))}
        </div>
      </FiltersSection>
    </div>
  );
}
