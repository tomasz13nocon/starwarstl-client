import { mdiChevronDown, mdiChevronUp } from "@mdi/js";
import "./styles/filtersSection.scss";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import Icon from "@components/icon";

export default function FiltersSection({ title, gaps, titlebarContent, children }) {
  const [expanded, setExpanded] = useLocalStorage("filtersSectionExpanded_" + title, true);
  return (
    <div className="filters-section">
      <div className="filters-section-title">
        <h2 className="title">{title}</h2>
        {titlebarContent}
        <Icon
          onClick={() => setExpanded(!expanded)}
          path={expanded ? mdiChevronUp : mdiChevronDown}
          className="expand-button"
        />
      </div>
      <hr />
      {expanded && <div className={`contents ${gaps ? "gaps" : ""}`}>{children}</div>}
    </div>
  );
}
