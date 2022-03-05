import React from "react";

import {
  default as TimelineRowDetails,
  ANIMATION_TIME,
} from "./timelineRowDetails";

export default function TimelineRow({ item, activeColumns, style }) {
  if (item === undefined) return null;
  const timeoutId = React.useRef();
  // shown - state encompassing the hiding animation
  // expanded - instantly changing state
  const [shown, setShown] = React.useState(false);
  const [expanded, toggleExpanded] = React.useReducer((state) => {
    clearTimeout(timeoutId.current);
    if (state) {
      timeoutId.current = setTimeout(() => setShown(false), ANIMATION_TIME);
    } else setShown(true);
    return /* window.getSelection().type === "Range" ? state : */ !state;
  }, false);

  const cells = activeColumns.map((columnName) => {
    let inside, classNames = "", onClick;
    switch (columnName) {
      case "cover":
        inside = <img src={item.cover} />;
        break;
      case "writer":
        if (item.writer?.length > 1) {
          inside = (
            <ul>
              {item.writer.map((writer) => (
                <li key={writer}>{writer}</li>
              ))}
            </ul>
          );
        } else {
          inside = item.writer;
        }
        break;
      case "title":
        // Button for accessiblity
        inside = <button name="expand">{item[columnName]}</button>;
        classNames += ` ${item.type.replace(" ", "-")}`;
        onClick = toggleExpanded;
        break;

      case "releaseDate":
        let d = new Date(/^\d{4}$/.test(item.releaseDate) ? `${item.releaseDate}-12-31` : item.releaseDate);
        if (isNaN(d) || d > Date.now()) classNames += " unreleased";
      default:
        inside = item[columnName];
    }
    return (
      <div key={item.id + columnName} className={columnName + " td" + classNames} onClick={onClick}>
        <div className="td-inner">
          {inside}
        </div>
      </div>
    );
  });

  return (
    <>
      <div className={"standard-row tr"} style={style}>
        {cells}
        {shown ? (
          <TimelineRowDetails
            expanded={expanded}
            item={item}
          />
        ) : null}
      </div>
    </>
  );
};
