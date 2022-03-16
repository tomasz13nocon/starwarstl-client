import React from "react";
import _ from "lodash";

import CheckboxGroup from "./checkboxGroup.js";
import "./styles/filters.scss";

export default function Filters({
  filterText,
  filterTextChanged,
  filters,
  filtersChanged,
  filtersTemplate,
}) {
  return (
    <div className="filter">
      <div className="search">
        <input
          type="text"
          value={filterText}
          onChange={(e) => filterTextChanged(e.target.value)}
          placeholder="Search..."
        />
        {filterText ? (
          <button
            className="clear-input"
            onClick={(e) => filterTextChanged("")}
            aria-label="Clear search"
          >
            &times;
          </button>
        ) : null}
      </div>

      <div className="checkbox-filters">
        <div className="check-buttons">
          <button
            className="show-button"
            onClick={() => filtersChanged({ path: "type", to: true })}
          >
            CHECK ALL
          </button>
          <button
            className="hide-button"
            onClick={() => filtersChanged({ path: "type", to: false })}
          >
            UNCHECK ALL
          </button>
        </div>
        <CheckboxGroup state={filters} onChange={filtersChanged}>
          {filtersTemplate}
        </CheckboxGroup>
      </div>
    </div>
  );
}
