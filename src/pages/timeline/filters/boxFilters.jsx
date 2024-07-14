import WookieeLink from "@components/wookieeLink";
import FiltersSection from "./filtersSection";
import { appearancesIcons } from "@/util";
import Checkbox from "@components/checkbox";
import FilterBullet from "@components/filterBullet";

import c from "./styles/boxFilters.module.scss";
import Icon from "@components/icon";

export default function BoxFilters({ boxFilters, setBoxFilters, boxFiltersAnd, setBoxFiltersAnd }) {
  return (
    <>
      {boxFilters.length > 0 && (
        <FiltersSection title="Active filters">
          {boxFilters.length > 1 && boxFilters.find((f) => f.category) && (
            <div className={c.includeAllCheckbox}>
              <Checkbox name="Must include all" value={boxFiltersAnd} onChange={setBoxFiltersAnd} />
            </div>
          )}
          {boxFilters.map((boxFilter) => (
            <FilterBullet
              key={boxFilter._id}
              className={`${boxFilter.type} ${boxFilter.fullType}`}
              buttonClassName={`${boxFilter.type}-reversed ${boxFilter.fullType}-reversed`}
              buttonOnClick={() =>
                setBoxFilters([...boxFilters.filter((el) => el._id !== boxFilter._id)])
              }
            >
              {boxFilter.category && (
                <Icon
                  path={appearancesIcons[boxFilter.category]}
                  size={0.8333333333}
                  className={c.categoryIcon}
                />
              )}
              <span className={c.text}>
                {boxFilter.displayTitle || boxFilter.title || boxFilter.name}
                <WookieeLink title={boxFilter.title || boxFilter.name} />
              </span>
            </FilterBullet>
          ))}
        </FiltersSection>
      )}
    </>
  );
}
