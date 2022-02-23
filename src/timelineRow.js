import React from "react";

import {
  default as TimelineRowDetails,
  ANIMATION_TIME,
} from "./timelineRowDetails";

export default React.memo(function TimelineRow({ item, activeColumns }) {
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
    let inside;
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
          <td
            key={item.id + columnName}
            className={columnName + " " + item.type.replace(" ", "-")}
            onClick={toggleExpanded}
          >
            <button name="expand">{item[columnName]}</button>
          </td>
        );
      default:
        inside = item[columnName];
    }
    return (
      <td key={item.id + columnName} className={columnName}>
        {inside}
      </td>
    );
  });

  return (
    <>
      <tr className={"standard-row"}>{cells}</tr>
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
