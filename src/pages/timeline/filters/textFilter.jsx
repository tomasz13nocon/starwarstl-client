import { API, appearancesCategories, suggestionPriority } from "@/util";
import ClearableTextInput from "@components/clearableTextInput";
import AppearancesIcons from "./appearancesIcons";
import { useEffect, useRef, useState } from "react";

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
  const [fetchingAppearances, setFetchingAppearances] = useState("");
  const inputRef = useRef(null);

  const handleFilterTextChange = (newFilterText) => {
    setFilterText(newFilterText);
  };

  async function handleClick(name) {
    setFilterCategory(name);
    inputRef.current.focus();
    if (appearancesCategories.includes(name)) {
      let apps = appearances[name];
      if (!apps) {
        // TODO err handling
        setFetchingAppearances(name);
        let res = await fetch(`${API}appearances/${name}`);
        apps = await res.json();
        setFetchingAppearances("");
        setAppearances((state) => ({ ...state, [name]: apps }));
      }
    }
  }

  // Suggestions are derived state, hence useEffect
  useEffect(() => {
    if (!filterText) {
      setSuggestions([]);
      return;
    }

    let query = filterText.toLowerCase().trim();

    // if (query.length < 2) {
    //   setSuggestions([]);
    //   return;
    // }

    if (filterCategory) {
      // Appearances
      setSuggestions(
        appearances[filterCategory]
          ?.filter(
            (item) =>
              item.name.toLowerCase().includes(query) &&
              !boxFilters.find((b) => b.name === item.name)
          )
          .sort((a, b) => b.ids.length - a.ids.length)
          .slice(0, 10)
          .map((app) => ({ ...app, _id: app.name, category: filterCategory })) ?? []
      );
    } else {
      // Series
      let found = seriesArr.filter((item) =>
        item.displayTitle
          ? item.displayTitle.toLowerCase().includes(query)
          : item.title.toLowerCase().includes(query)
      );
      // TODO: indicate fetching of series
      if (found.length) {
        setSuggestions(
          found
            .filter((el) => !boxFilters.includes(el))
            .sort((a, b) => {
              let ap = suggestionPriority.indexOf(a.fullType || a.type),
                bp = suggestionPriority.indexOf(b.fullType || b.type);
              if (ap > bp) return 1;
              if (ap < bp) return -1;
              return 0;
            })
            .slice(0, 10)
        );
      }
    }
  }, [filterText, appearances, filterCategory]);

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
      <AppearancesIcons
        handleClick={handleClick}
        activeCategory={filterCategory}
        fetching={fetchingAppearances}
      />
      {suggestions.length > 0 && (
        <div className="search-suggestions">
          <span className="suggestions-heading">Suggestions:</span>
          {suggestions.map((el) => (
            <button
              key={el._id}
              className={`suggestion ${el.type} ${el.fullType}`}
              onClick={() => {
                setBoxFilters([...boxFilters, el]);
                setFilterText("");
                setSuggestions([]);
              }}
            >
              {el.displayTitle || el.title || el.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
