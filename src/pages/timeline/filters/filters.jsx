import React from "react";
import { mdiFilterMultiple } from "@mdi/js";
import { Icon } from "@mdi/react";
import "./styles/filters.scss";
import useResponsive from "@hooks/useResponsive";

export default React.memo(function Filters({ showFilters, setShowFilters, children }) {
  const smallScreen = useResponsive(1086);

  return (
    <div className={`filters-container ${showFilters && smallScreen ? "visible" : ""}`}>
      <div className="filters">{children}</div>
      {smallScreen ? (
        <button
          className={`filters-btn ${showFilters ? "filters-visible" : ""}`}
          onClick={() => setShowFilters(!showFilters)}
        >
          <Icon path={mdiFilterMultiple} size={1.6} className="icon" />
        </button>
      ) : null}
    </div>
  );
});
