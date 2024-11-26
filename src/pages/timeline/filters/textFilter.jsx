import { appearancesCategories, fetchHelper, suggestionPriority } from "@/util";
import ClearableTextInput from "@components/clearableTextInput";
import AppearancesIcons from "./appearancesIcons";
import { useEffect, useRef, useState } from "react";
import { Virtuoso } from "react-virtuoso";
import { AnalyticsCategories, analytics } from "@/analytics";
import Alert from "@components/alert";
import clsx from "clsx";

export default function TextFilter({
  filterText,
  setFilterText,
  seriesArr,
  boxFilters,
  setBoxFilters,
  filterCategory,
  setFilterCategory,
  appearances,
  setAppearances,
}) {
  const [suggestions, setSuggestions] = useState([]);
  const [fetchingAppearances, setFetchingAppearances] = useState("");
  const [error, setError] = useState();
  const inputRef = useRef(null);

  const handleFilterTextChange = (newFilterText) => {
    setFilterText(newFilterText);
  };

  async function handleAppearanceIconClick(name) {
    if (name === filterCategory) {
      setFilterCategory("");
      return;
    }
    analytics.logEvent("Appearances", "Icon click", name);
    setFilterCategory(name);
    inputRef.current.focus();
    if (appearancesCategories.includes(name)) {
      let apps = appearances[name];
      if (!apps) {
        setFetchingAppearances(name);
        setError(null);
        try {
          apps = await fetchHelper(`appearances/${name}`);
        } catch (err) {
          setError(err.message);
        } finally {
          setFetchingAppearances("");
        }
        setAppearances((state) => ({ ...state, [name]: apps }));
      }
    }
  }

  // Suggestions are derived state, hence useEffect
  useEffect(() => {
    const query = filterText.toLowerCase().trim();

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
              !boxFilters.find((b) => b.name === item.name),
          )
          .sort((a, b) => b.media.length - a.media.length)
          // .slice(0, 10)
          .map((app) => ({ ...app, _id: app.name, category: filterCategory })) ?? [],
      );
    } else {
      // Series
      if (!filterText) {
        setSuggestions([]);
        return;
      }

      const found = seriesArr.filter((item) =>
        item.displayTitle
          ? item.displayTitle.toLowerCase().includes(query)
          : item.title.toLowerCase().includes(query),
      );
      // TODO: indicate fetching of series
      if (found.length) {
        setSuggestions(
          found
            .filter((el) => !boxFilters.includes(el))
            .sort((a, b) => {
              const ap = suggestionPriority.indexOf(a.fullType || a.type),
                bp = suggestionPriority.indexOf(b.fullType || b.type);
              if (ap > bp) return 1;
              if (ap < bp) return -1;
              return 0;
            }),
          // .slice(0, 10)
        );
      } else {
        setSuggestions([]);
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
        handleClick={handleAppearanceIconClick}
        activeCategory={filterCategory}
        fetching={fetchingAppearances}
      />
      {error && <Alert type="error">{error}</Alert>}
      {suggestions.length > 0 && (
        <>
          <span className="suggestions-heading">Suggestions:</span>
          <div className="search-suggestions-container">
            <div className="search-suggestions">
              <Virtuoso
                style={{ height: `${Math.min(46 * suggestions.length, 250)}px` }}
                overscan={200}
                data={suggestions}
                itemContent={(index, el) => (
                  <button
                    className={clsx(
                      "suggestion",
                      el.type,
                      el.fullType,
                      filterCategory && "non-media-suggestion",
                      index === 0 && "first-suggestion",
                    )}
                    onClick={() => {
                      setBoxFilters([...boxFilters, el]);
                      analytics.logEvent(
                        AnalyticsCategories.appearances,
                        "Suggestion click",
                        el.displayTitle || el.title || el.name,
                      );
                      setFilterText("");
                      setFilterCategory("");
                      setSuggestions([]);
                    }}
                  >
                    {el.displayTitle || el.title || el.name}
                  </button>
                )}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
