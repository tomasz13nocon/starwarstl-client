import React from "react";
import { NavLink } from "react-router-dom";

import "./styles/showcase.scss";

export default function Showcase() {
  return (
    <section className="showcase">

      <h2 className="showcase-title">Features</h2>

      <div className="showcase-feature">
        <section className="text">
          <h3>Filter by text</h3>
          <p>
            Title, writer and series fields are searched.
          </p>
          <img src="/img/screenshots/text-filters.png" alt="Claudia Gray as text filter" className="image-first" loading="lazy" />
          <img src="/img/arrow.svg" alt="arrow pointing to another image" width="120" className="arrow" />
          <img src="/img/arrow_vertical.svg" alt="arrow pointing to another image" height="100" className="arrow-vertical" />
        </section>
        <div className="image">
          <img src="/img/screenshots/text-filters2a.png " alt="Table with media writter by Claudia Gray" loading="lazy" />
        </div>
      </div>

      <div className="showcase-feature">
        <section className="text">
          <h3>Filter by series</h3>
          <p>
            Click on one of the suggested series. You can have multiple series filters active.
          </p>
          <img src="/img/screenshots/series-filters.png" alt="" className="image-first" loading="lazy" />
          <img src="/img/arrow.svg" alt="arrow pointing to another image" width="120" className="arrow" />
          <img src="/img/arrow_vertical.svg" alt="arrow pointing to another image" height="100" className="arrow-vertical" />
        </section>
        <div className="image">
          <img src="/img/screenshots/series-filters3a.png" alt="" loading="lazy" />
        </div>
      </div>

      <div className="showcase-feature">
        <section className="text">
          <h3>Collapse episodes</h3>
          <p>
            Click on "Collapse adjacent episodes" to view the succint results. This works with comic and tv series.
          </p>
          <img src="/img/screenshots/collapse.png" alt="" className="image-first" loading="lazy" />
          <img src="/img/arrow.svg" alt="arrow pointing to another image" width="120" className="arrow" />
          <img src="/img/arrow_vertical.svg" alt="arrow pointing to another image" height="100" className="arrow-vertical" />
        </section>
        <div className="image">
          <img src="/img/screenshots/collapse4a.png" alt="" loading="lazy" />
        </div>
      </div>

      <div className="showcase-feature">
        <section className="text">
          <h3>Filter by type</h3>
          <p>
            Right click (or tap and hold on mobile), to select only that filter, deselecting all others.
          </p>
          <p>
            Note that these stack with other filters.<br/>
            For example if you also filter by some text, only entries containing that text <strong>and</strong> entries of selected types will appear.
          </p>
        </section>
        <div className="image">
          <img src="/img/screenshots/type-filters2.png" alt="" loading="lazy" />
        </div>
      </div>

      <div className="more">
          <h3>And more...</h3>
          <NavLink to="/timeline" className="btn">See Timeline</NavLink>
      </div>

    </section>
  );
}
