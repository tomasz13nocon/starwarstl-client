import { API, appearancesCategoriesNames } from "@/util";
import { useEffect, useState } from "react";
import "./styles/appearances.scss";
import AppearancesNode from "./appearancesList";
import NetworkError from "@components/inlineAlerts/networkError";
import Fetching from "@components/inlineAlerts/fetching";

export default function Appearances({ id }) {
  const [appearances, setAppearances] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);

  useEffect(() => {
    setFetching(true);
    fetch(`${API}media/${id}/appearances`)
      .then((res) => res.json())
      .then((data) => {
        setAppearances(data);
        setActiveCategory(data.find((cat) => cat.value.length > 0));
      })
      .catch((err) => setError(err))
      .finally(() => setFetching(false));
  }, []);

  const canonCatName = "c-" + activeCategory?.name.substring(2);
  const legendsCatName = "l-" + activeCategory?.name.substring(2);
  const canonCat = appearances.find((cat) => cat.name === canonCatName);
  const legendsCat = appearances.find((cat) => cat.name === legendsCatName);
  let displayedCats = [];
  return (
    <div className="apps-container">
      {fetching && <Fetching />}
      {error && <NetworkError />}
      {!fetching && !error && (
        <>
          <ul className="apps-cat-list">
            {appearances.map((category) => {
              if (displayedCats.includes(appearancesCategoriesNames[category.name])) return null;
              displayedCats.push(appearancesCategoriesNames[category.name]);
              return (
                <li
                  key={category.name}
                  className={`apps-cat apps-cat-btn-container ${
                    category.name === activeCategory?.name ||
                    category.name === canonCatName ||
                    category.name === legendsCatName
                      ? "active"
                      : ""
                  }`}
                >
                  <button
                    className="apps-cat-btn"
                    disabled={category.value.length === 0}
                    onClick={() => setActiveCategory(category)}
                  >
                    {appearancesCategoriesNames[category.name]}
                  </button>
                </li>
              );
            })}
          </ul>

          {canonCat && legendsCat && (
            <ul className="apps-cat-list">
              <li
                className={`apps-cat-canonicity apps-cat-btn-container ${
                  activeCategory?.name === canonCatName ? "active" : ""
                }`}
              >
                <button onClick={() => setActiveCategory(canonCat)} className="apps-cat-btn">
                  Canon
                </button>
              </li>
              <li
                className={`apps-cat-canonicity apps-cat-btn-container ${
                  activeCategory?.name === legendsCatName ? "active" : ""
                }`}
              >
                <button onClick={() => setActiveCategory(legendsCat)} className="apps-cat-btn">
                  Legends
                </button>
              </li>
            </ul>
          )}

          {activeCategory && <AppearancesNode appearances={activeCategory.value[0]} />}
        </>
      )}
    </div>
  );
}
