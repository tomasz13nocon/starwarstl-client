import React from "react";
import { Icon } from "@mdi/react";
import { mdiChevronDown, mdiChevronUp } from "@mdi/js";
import "./styles/filtersSection.scss";

export default function FiltersSection({ title, gaps, titlebarContent, children }) {
  const [expanded, toggleExpanded] = React.useReducer(
    (s) => { localStorage.setItem("filtersSectionExpanded_" + title, !s); return !s; },
    true,
    (d) => { let ls = localStorage.getItem("filtersSectionExpanded_" + title); if (ls === null) return d; return ls === "true"; }
  );
  return (
    <div className="filters-section">
      <div className="filters-section-title">
        <h2 className="title">{title}</h2>
        {titlebarContent}
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
