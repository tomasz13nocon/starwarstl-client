import { API, appearancesCategories, suggestionPriority } from "@/util";
import ClearableTextInput from "@components/clearableTextInput";
import AppearancesIcons from "./appearancesIcons";
import { useRef, useState } from "react";

export default function TextFilter({
  filterText,
  setFilterText,
  seriesArr,
  suggestions,
  setSuggestions,
  boxFilters,
  setBoxFilters,
  filterCategory,
  setFilterCategory,
  appearances,
  setAppearances,
}) {
  const inputRef = useRef(null);

  const handleFilterTextChange = (newFilterText) => {
    setFilterText(newFilterText);

    // Search suggestions
    let newSuggestions = [];
    if (newFilterText) {
      let queries = [newFilterText.toLowerCase()];
      let last = queries[queries.length - 1].trim();
      if (last.length >= 2) {
        let found = seriesArr.filter((item) =>
          item.displayTitle
            ? item.displayTitle.toLowerCase().includes(last)
            : item.title.toLowerCase().includes(last)
        );
        // TODO: indicate fetching of series
        if (found.length) {
          newSuggestions = found
            .filter((el) => !boxFilters.includes(el))
            .sort((a, b) => {
              let ap = suggestionPriority.indexOf(a.fullType || a.type),
                bp = suggestionPriority.indexOf(b.fullType || b.type);
              if (ap > bp) return 1;
              if (ap < bp) return -1;
              return 0;
            })
            .slice(0, 10);
        }
      }
    }
    setSuggestions(newSuggestions);
  };

  async function handleClick(name) {
    setFilterCategory(name);
    inputRef.current.focus();
    if (appearancesCategories.includes(name)) {
      if (!appearances[name]) {
        // TODO err handling
        let res = await fetch(`${API}appearances/${name}`);
        let json = await res.json();
        setAppearances((state) => ({ ...state, [name]: json }));
      }
    }
  }

  return (
    <div>
      <ClearableTextInput
        value={filterText}
        onChange={handleFilterTextChange}
        clearBullet={() => setFilterCategory("")}
        active={filterText}
        bullet={filterCategory}
        placeholder="Filter..."
        ref={inputRef}
      />
      <AppearancesIcons handleClick={handleClick} />
      {suggestions.length > 0 && (
        <div className="search-suggestions">
          <span className="suggestions-heading">Suggestions:</span>
          {suggestions.map((el) => (
            <button
              key={el._id}
              className={`reset-button suggestion ${el.type} ${el.fullType}`}
              onClick={() => {
                setBoxFilters([...boxFilters, el]);
                setFilterText("");
                setSuggestions([]);
              }}
            >
              {el.displayTitle || el.title}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
