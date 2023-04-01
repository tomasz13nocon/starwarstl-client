import React from "react";
import Checkbox from "@components/checkbox";
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
    <FiltersSection title="Miscellaneous">
      <Checkbox
        name={"Hide unreleased"}
        value={hideUnreleased}
        onChange={setHideUnreleased}
      />
      <Checkbox
        name={"Hide adaptations"}
        value={hideAdaptations}
        onChange={setHideAdaptations}
      />
      <Checkbox
        name={"Collapse adjacent episodes"}
        value={collapseAdjacent}
        onChange={setCollapseAdjacent}
      />
    </FiltersSection>
  );
}
