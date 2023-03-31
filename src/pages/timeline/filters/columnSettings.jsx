import React from "react";
import Checkbox from "../../../components/checkbox";
import FiltersSection from "./filtersSection";
import { columnNames } from "../../../util";

// import "./styles/columnSettings.scss";

export default function ColumnSettings({
  columns,
  setColumns,
}) {
  return (
    <FiltersSection title={"Show columns"}>
      {Object.entries(columns)
        .filter(e => e[0] !== "title") // Don't allow hiding title
        .map(([column, value]) => (
          <Checkbox
            key={column}
            name={columnNames[column]}
            value={value}
            onChange={(to) => setColumns(state => ({ ...state, [column]: to }))}
          />
        ))}
    </FiltersSection>
  );
}
