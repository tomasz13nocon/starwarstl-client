import React from "react";
import { mdiClose } from "@mdi/js";
import { Icon } from "@mdi/react";
import WookieeLink from "@components/wookieeLink";
import FiltersSection from "./filtersSection";
import "./styles/boxFilters.scss";

export default function BoxFilters({
  boxFilters,
  setBoxFilters,
}) {
  return (
    <>
      {boxFilters.length > 0 &&
        <FiltersSection title="Series filters">
          {boxFilters.map((boxFilter) => (
            <div
              key={boxFilter._id}
              className={`type-indicator2 ${boxFilter.type} ${boxFilter.fullType}`}
            >
              <span className="text">
                {boxFilter.displayTitle || boxFilter.title}
                <WookieeLink title={boxFilter.title}></WookieeLink>
              </span>
              <button
                className={`reset-button curp remove ${boxFilter.type}-reversed ${boxFilter.fullType}-reversed`}
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
        </FiltersSection>
      }
    </>
  );
}
