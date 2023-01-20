import React from "react";
import Checkbox from "./checkbox";
import FiltersSection from "./filtersSection";

export default function CheckboxSettings({
  hideUnreleased,
  setHideUnreleased,
  hideAdaptations,
  setHideAdaptations,
  collapseAdjacent,
  setCollapseAdjacent,
}) {
  return (
    <FiltersSection title="Options">
      <Checkbox
        name={"Hide unreleased"}
        value={hideUnreleased}
        onChange={({ to }) => setHideUnreleased(to)}
      />
      <Checkbox
        name={"Hide adaptations"}
        value={hideAdaptations}
        onChange={({ to }) => setHideAdaptations(to)}
      />
      <Checkbox
        name={"Collapse adjacent episodes"}
        value={collapseAdjacent}
        onChange={({ to }) => setCollapseAdjacent(to)}
      />
    </FiltersSection>
  );
}
