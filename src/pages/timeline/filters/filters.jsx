import { memo, useLayoutEffect, useRef, useState } from "react";
import { mdiFilterMultiple } from "@mdi/js";
import "./styles/filters.scss";
import useResponsive from "@hooks/useResponsive";
import Icon from "@components/icon";

export default memo(function Filters({ showFilters, setShowFilters, children }) {
  const smallScreen = useResponsive(1086);
  const filtersContainerRef = useRef(null);
  const [containerOffset, setContainerOffset] = useState(0);

  useLayoutEffect(() => {
    const onScroll = () => {
      const rect = filtersContainerRef.current?.getBoundingClientRect();
      setContainerOffset(rect.top);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  });

  return (
    <div
      className={`filters-container ${showFilters && smallScreen ? "visible" : ""}`}
      style={{ "--container-offset": containerOffset + "px" }}
      ref={filtersContainerRef}
    >
      <div className="filters">{children}</div>
      {smallScreen ? (
        <button
          className={`filters-btn ${showFilters ? "filters-visible" : ""}`}
          onClick={() => setShowFilters(!showFilters)}
        >
          <Icon path={mdiFilterMultiple} size={1.6} />
        </button>
      ) : null}
    </div>
  );
});
