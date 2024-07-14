import { API, appearancesCategoriesNames, fetchHelper } from "@/util";
import { useEffect, useState } from "react";
import AppearancesNode from "./appearancesList";
import NetworkError from "@components/inlineAlerts/networkError";
import Fetching from "@components/inlineAlerts/fetching";
import c from "./styles/appearances.module.scss";
import clsx from "clsx";

export default function Appearances({ id }) {
  const [appearances, setAppearances] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);

  useEffect(() => {
    setFetching(true);
    fetchHelper(`media/${id}/appearances`)
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
    <div className={c.appsContainer}>
      {fetching && <Fetching />}
      {error && <NetworkError />}
      {!fetching && !error && (
        <>
          <ul className={c.appsCatList}>
            {appearances.map((category) => {
              if (displayedCats.includes(appearancesCategoriesNames[category.name])) return null;
              displayedCats.push(appearancesCategoriesNames[category.name]);
              // TODO: chnage these into Radix tabs
              return (
                <li
                  key={category.name}
                  className={clsx(
                    c.appsCat,
                    c.appsCatBtnContainer,
                    category.name === activeCategory?.name ||
                      category.name === canonCatName ||
                      category.name === legendsCatName
                      ? c.active
                      : "",
                  )}
                >
                  <button
                    className={c.appsCatBtn}
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
            <ul className={c.appsCatList}>
              <li
                className={clsx(
                  c.appsCatCanonicity,
                  c.appsCatBtnContainer,
                  activeCategory?.name === canonCatName && c.active,
                )}
              >
                <button onClick={() => setActiveCategory(canonCat)} className={c.appsCatBtn}>
                  Canon
                </button>
              </li>
              <li
                className={clsx(
                  c.appsCatCanonicity,
                  c.appsCatBtnContainer,
                  activeCategory?.name === legendsCatName && c.active,
                )}
              >
                <button onClick={() => setActiveCategory(legendsCat)} className={c.appsCatBtn}>
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
