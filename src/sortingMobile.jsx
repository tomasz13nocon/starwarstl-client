import React from "react";
import { columnNames, notSortable } from "./common";
import FiltersSection from "./filtersSection";
import SortingIcon from "./sortingIcon";

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
