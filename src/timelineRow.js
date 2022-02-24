import React from "react";

import {
  default as TimelineRowDetails,
  ANIMATION_TIME,
} from "./timelineRowDetails";

export default React.memo(function TimelineRow({ item, activeColumns, style, measureRef, useDivs = false }) {
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
    let inside, classNames = "";
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
          // TODO: remove the "author"?
          inside = item.author || item.writer;
        }
        break;
      case "title":
        // Button for accessiblity
        return (
          useDivs ? 
          <div
            key={item.id + columnName}
            className={columnName + " " + item.type.replace(" ", "-") + " td"}
            onClick={toggleExpanded}
          >
            <button name="expand">{item[columnName]}</button>
          </div>
          :
          <td
            key={item.id + columnName}
            className={columnName + " " + item.type.replace(" ", "-") + " td"}
            onClick={toggleExpanded}
          >
            <button name="expand">{item[columnName]}</button>
          </td>
        );
      case "releaseDate":
        let d = new Date(/^\d{4}$/.test(item.releaseDate) ? `${item.releaseDate}-12-31` : item.releaseDate);
        if (isNaN(d) || d > Date.now()) classNames += " unreleased";
      default:
        inside = item[columnName];
    }
    return (
      useDivs ? 
      <div key={item.id + columnName} className={columnName + " td" + classNames}>
        {inside}
      </div>
      :
      <td key={item.id + columnName} className={columnName + " td" + classNames}>
        {inside}
      </td>
    );
  });

  return (
    <>
      {useDivs ? 
      <div ref={measureRef} className={"standard-row tr"} style={style}>{cells}</div>
      :
      <tr ref={measureRef} className={"standard-row tr"} style={style}>{cells}</tr>
      }
      {shown ? (
        <TimelineRowDetails
          expanded={expanded}
          item={item}
          colspan={activeColumns.length}
        />
      ) : null}
    </>
  );
});
