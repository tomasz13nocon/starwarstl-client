import Button from "@components/button";
import CheckboxGroup from "./checkboxGroup";
import FiltersSection from "./filtersSection";
import "./styles/typeFilters.scss";

export default function TypeFilters({ typeFilters, filtersChanged, filtersTemplate }) {
  return (
    <FiltersSection title="Media type" gaps>
      <div className="check-buttons">
        <Button onClick={() => filtersChanged({ path: "type", to: true })}>CHECK ALL</Button>
        <Button onClick={() => filtersChanged({ path: "type", to: false })}>UNCHECK ALL</Button>
      </div>

      <div className="checkbox-filters">
        <CheckboxGroup state={typeFilters} onChange={filtersChanged}>
          {filtersTemplate}
        </CheckboxGroup>
      </div>
    </FiltersSection>
  );
}
