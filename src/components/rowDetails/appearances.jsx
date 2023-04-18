import { API, appearancesCategories } from "@/util";
import { useEffect, useState } from "react";
import "./styles/appearances.scss";
import AppearancesNode from "./appearancesList";

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

  return (
    <div className="apps-container">
      {fetching && <p>Fetching appearances...</p>}
      {error && <p>There was an error fetching appearances.</p>}
      {!fetching && !error && (
        <>
          <ul className="apps-cat-list">
            {appearances.map((category) => (
              <li
                key={category.name}
                className={`apps-cat ${category.name === activeCategory?.name ? "active" : ""}`}
              >
                <button
                  className={`reset-button`}
                  disabled={category.value.length === 0}
                  onClick={() => setActiveCategory(category)}
                >
                  {appearancesCategories[category.name]}
                </button>
              </li>
            ))}
          </ul>
          {activeCategory && <AppearancesNode appearances={activeCategory.value[0]} />}
        </>
      )}
    </div>
  );
}
