import Checkbox from "@components/checkbox";
import FiltersSection from "./filtersSection";

export default function AppearancesFilterSettings({ appearancesFilters, setAppearancesFilters }) {
  return (
    <>
      <FiltersSection title="Appearances">
        <Checkbox
          name={"Hide mentions"}
          value={appearancesFilters.hideMentions}
          onChange={(value) => setAppearancesFilters((old) => ({ ...old, hideMentions: value }))}
        />
        <Checkbox
          name={"Hide indirect mentions"}
          value={appearancesFilters.hideIndirectMentions}
          onChange={(value) =>
            setAppearancesFilters((old) => ({ ...old, hideIndirectMentions: value }))
          }
        />
        <Checkbox
          name={"Hide flashbacks"}
          value={appearancesFilters.hideFlashbacks}
          onChange={(value) => setAppearancesFilters((old) => ({ ...old, hideFlashbacks: value }))}
        />
        <Checkbox
          name={"Hide holograms"}
          value={appearancesFilters.hideHolograms}
          onChange={(value) => setAppearancesFilters((old) => ({ ...old, hideHolograms: value }))}
        />
      </FiltersSection>
    </>
  );
}
