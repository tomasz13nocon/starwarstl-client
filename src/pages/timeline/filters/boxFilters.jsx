import { mdiClose } from "@mdi/js";
import { Icon } from "@mdi/react";
import WookieeLink from "@components/wookieeLink";
import FiltersSection from "./filtersSection";
import "./styles/boxFilters.scss";
import { appearancesIcons } from "@/util";

export default function BoxFilters({ boxFilters, setBoxFilters }) {
  return (
    <>
      {boxFilters.length > 0 && (
        <FiltersSection title="Active filters">
          {boxFilters.map((boxFilter) => (
            <div
              key={boxFilter._id}
              className={`type-indicator2 ${boxFilter.type} ${boxFilter.fullType}`}
            >
              {boxFilter.category && (
                <Icon
                  path={appearancesIcons[boxFilter.category]}
                  size={0.8333333333}
                  className="icon box-filter-category-icon"
                />
              )}
              <span className="text">
                {boxFilter.displayTitle || boxFilter.title || boxFilter.name}
                <WookieeLink title={boxFilter.title || boxFilter.name}></WookieeLink>
              </span>
              <button
                className={`curp remove-box-filter ${boxFilter.type}-reversed ${boxFilter.fullType}-reversed`}
                onClick={() =>
                  setBoxFilters([...boxFilters.filter((el) => el._id !== boxFilter._id)])
                }
              >
                <Icon className={`icon`} path={mdiClose} />
              </button>
            </div>
          ))}
        </FiltersSection>
      )}
    </>
  );
}
