import React from "react";
import Icon from "@mdi/react";
import { mdiMagnify, mdiClose } from "@mdi/js";
import "./styles/search.scss";

export default function Search({ searchText, searchTextChanged, expanded, toggleExpanded }) {
  const searchInputRef = React.useRef();

  React.useEffect(() => {
    window.addEventListener("keydown",function (e) {             
      if (e.keyCode === 114 || (e.ctrlKey && e.keyCode === 70) || (e.ctrlKey && e.keyCode === 71)) {
        e.preventDefault();         
        toggleExpanded(true);
        searchInputRef.current?.focus();
      }      
    });
  }, []);

  return (
    <div className="clear-input-container search-container">
      {expanded ?
        <>
          <input ref={searchInputRef} type="text" placeholder="Search..." className="input-default" value={searchText} onChange={(e) => searchTextChanged(e.target.value)} autoFocus onKeyDown={(e) => e.key === "Escape" && toggleExpanded()} />
          <button
            className="clear-input"
            onClick={(e) => toggleExpanded()}
            aria-label="Clear search"
          >
            <Icon path={mdiClose} size={1.5} className="icon" />
          </button>
          </>
        :
        <button
          className={`circle-button search-button`}
          onClick={toggleExpanded}
        >
          <Icon path={mdiMagnify} size={1.5} className="icon" />
        </button>
    }
    </div>
  );
}
