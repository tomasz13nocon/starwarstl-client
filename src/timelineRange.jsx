import React from "react";

import ClearableTextInput from "./clearableTextInput";
import { ERA_IMAGE_PATH } from "./common";
import FiltersSection from "./filtersSection";
import Radio from "./radio";
import "./styles/timelineRange.scss";

const eras = [
  {
    name: "The High Republic",
    img: "HighRepublic.webp",
    from: "500 BBY",
    to: "82 BBY",
  },
  {
    name: "Fall of the Republic",
    img: "Republic_Emblem.svg",
    from: "81 BBY",
    to: "Star Wars: Episode III Revenge of the Sith",
  },
  {
    name: "Imperial Era",
    img: "Imperial_Emblem.svg",
    from: "Star Wars: Episode III Revenge of the Sith",
    to: "Star Wars: Episode VI Return of the Jedi",
  },
  {
    name: "New Republic",
    img: "New_Republic_canon.svg",
    from: "Star Wars: Episode VI Return of the Jedi",
    to: "",
  },
];

export default function TimelineRange({
  timelineRangeBy,
  setTimelineRangeBy,
  rangeFrom,
  setRangeFrom,
  rangeTo,
  setRangeTo,
  fromValid,
  toValid,
}) {
  return (
    <FiltersSection title="Timeline range" gaps>
      <div className="range-by-selection">
        <Radio onChange={() => setTimelineRangeBy("date")} checked={timelineRangeBy === "date"}>Date</Radio>
        <Radio onChange={() => setTimelineRangeBy("releaseDate")} checked={timelineRangeBy === "releaseDate"}>Release date</Radio>
      </div>
      <div className="range-text-inputs">
        <ClearableTextInput value={rangeFrom} onChange={setRangeFrom} active={fromValid} small>From:</ClearableTextInput>
        <ClearableTextInput value={rangeTo} onChange={setRangeTo} active={toValid} small>To:</ClearableTextInput>
      </div>
      {/* TODO suggestions p.rangeTitleSuggestions */}
      <div className="eras">
        {eras.map(({name, img, from, to}) => 
          <div className={`era-container ${from === rangeFrom && to === rangeTo && timelineRangeBy === "date" ? "active" : ""}`} key={name} onClick={() => { setRangeFrom(from); setRangeTo(to); setTimelineRangeBy("date"); }}>
            <div className="era-img-container">
              <img className="era-img" src={`${ERA_IMAGE_PATH}${img}`} alt={`${name} symbol`} width={26} />
            </div>
            {/* <div style={{height:"100%",width:"1px",background:"rgb(155,155,155)"}}></div> */}
            <div className="era-name">{name}</div>
          </div>
        )}
      </div>
    </FiltersSection>
  );
}
