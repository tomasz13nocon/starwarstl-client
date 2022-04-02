import React from "react";
import _ from "lodash";
import { mdiClose } from "@mdi/js";
import Icon from "@mdi/react";

import CheckboxGroup from "./checkboxGroup.js";
import "./styles/filters.scss";

export default function Filters({
  filterText,
  filterTextChanged,
  filters,
  filtersChanged,
  filtersTemplate,
  suggestions,
  setSuggestions,
  boxFilters,
  setBoxFilters,
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

      <div className="search-suggestions">
        {suggestions.map((el) => (
          <button
            key={el._id}
            className={`reset-button suggestion ${el.type}`}
            onClick={() => {
              setBoxFilters([...boxFilters, el]);
              filterTextChanged("");
              setSuggestions([]);
            }}
          >
            {el.title}
          </button>
        ))}
      </div>

      <div className="box-filters">
        {boxFilters.map((boxFilter) => (
          <div
            key={boxFilter._id}
            className={`type-indicator ${boxFilter.type}`}
          >
            {boxFilter.title}
            <button
              className={`reset-button curp remove ${boxFilter.type}-reversed`}
              onClick={() =>
                setBoxFilters([
                  ...boxFilters.filter((el) => el._id !== boxFilter._id),
                ])
              }
            >
              <Icon className={`icon`} path={mdiClose} />
            </button>
          </div>
        ))}
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
