import Button from "@components/button";
import CheckboxGroup from "./checkboxGroup";
import FiltersSection from "./filtersSection";
import c from "./styles/typeFilters.module.scss";

export default function TypeFilters({ typeFilters, filtersChanged, filtersTemplate }) {
  return (
    <FiltersSection title="Media type" gaps>
      <div className={c.checkButtons}>
        <Button onClick={() => filtersChanged({ path: "type", to: true })}>CHECK ALL</Button>
        <Button onClick={() => filtersChanged({ path: "type", to: false })}>UNCHECK ALL</Button>
      </div>

      <div className={c.checkboxFilters}>
        <CheckboxGroup
          state={typeFilters}
          onChange={filtersChanged}
          wrapperClassName={c.checkboxWrapper}
        >
          {filtersTemplate}
        </CheckboxGroup>
      </div>
    </FiltersSection>
  );
}
