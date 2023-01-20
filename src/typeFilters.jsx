import React from "react";
import CheckboxGroup from "./checkboxGroup";
import FiltersSection from "./filtersSection";

import "./styles/typeFilters.scss";

export default function TypeFilters({
  filters,
  filtersChanged,
  filtersTemplate,
}) {
  return (
    <FiltersSection title="Media type" gaps>
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

      <div
        className="checkbox-filters"
      >
        <CheckboxGroup state={filters} onChange={filtersChanged}>
          {filtersTemplate}
        </CheckboxGroup>
      </div>
    </FiltersSection>
  );
}
