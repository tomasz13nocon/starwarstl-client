import React from "react";
import SortingIcon from "@components/sortingIcon";
import { columnNames, notSortable } from "@/util";
import FiltersSection from "./filtersSection";
import "./styles/sortingMobile.scss";

export default function SortingMobile({ columns, sorting, toggleSorting }) {
  return (
    <div className="sorting-mobile">
      <FiltersSection title="Sort by">
        <div className="sorting-btns">
          {Object.keys(columns)
            .filter((c) => !notSortable.includes(c))
            .map((column) => (
              <button
                className={`sorting-btn ${sorting.by === column ? "active" : ""}`}
                key={column}
                onClick={(e) => toggleSorting(column)}
              >
                <span>{columnNames[column]}</span>
                <SortingIcon sorting={sorting} name={column} />
              </button>
            ))}
        </div>
      </FiltersSection>
    </div>
  );
}
