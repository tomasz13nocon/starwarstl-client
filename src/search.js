import React from "react";
import Icon from "@mdi/react";
import { mdiMagnify } from "@mdi/js";
import "./styles/search.scss";

export default function Search() {
  const [expanded, toggleExpanded] = React.useReducer((state) => !state, false);

  return (
    <button
      className={`circle-button search-button ${expanded ? "expanded" : ""}`}
      onClick={toggleExpanded}
    >
      <Icon path={mdiMagnify} className="icon" />
    </button>
  );
}
