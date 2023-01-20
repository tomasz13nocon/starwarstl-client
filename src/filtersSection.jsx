import { mdiChevronDown, mdiChevronUp } from "@mdi/js";
import Icon from "@mdi/react";
import React from "react";

import "./styles/filtersSection.scss";

export default function FiltersSection({ title, gaps, children }) {
  const [expanded, toggleExpanded] = React.useReducer((s) => !s,true);
  return (
    <div className="filters-section">
      <div className="filters-section-title">
        <h2 className="title">{title}</h2>
        <Icon
          onClick={toggleExpanded}
          path={expanded ? mdiChevronUp : mdiChevronDown}
          className="icon expand-button"
        />
      </div>
      <hr />
      {expanded && <div className={`contents ${gaps ? "gaps" : ""}`}>{children}</div>}
    </div>
  );
}
