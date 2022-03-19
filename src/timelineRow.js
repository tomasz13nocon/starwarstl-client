import React from "react";
import { imgAddress, Size, TV_IMAGE_PATH, unscuffDate } from "./common.js";
import {
  ANIMATION_TIME,
  default as TimelineRowDetails,
} from "./timelineRowDetails";

export default function TimelineRow({
  item,
  activeColumns,
  style,
  setShowFullCover,
  tvImages,
}) {
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
    let inside,
      classNames = "",
      onClick;
    switch (columnName) {
      case "cover":
        inside = item.cover ? (
          <img src={imgAddress(item.cover, Size.THUMB)} />
        ) : (
          (classNames += " no-cover") && null
        );
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
        inside = (
          // TODO accessibility
          <div name="expand">
            {item[columnName]}
            {item.type === "tv" && item.series?.length ? (
              <>
                <img
                  // TODO: hover text
                  title={item.series}
                  alt={item.series}
                  className="tv-image"
                  height="16px"
                  src={TV_IMAGE_PATH + tvImages[item.series]}
                />
                {item.season || item.episode ? (
                  <small
                    title={`${item.season ? `season ${item.season}` : ""}${
                      item.seasonNote ? ` ${item.seasonNote}` : ""
                    }${item.episode ? `\nepisode ${item.episode}` : ""}`.trim()}
                    className="season-episode"
                  >
                    {`${item.season ? "S" + item.season : ""}${
                      item.seasonNote ? `-${item.seasonNote}` : ""
                    } ${item.episode ? "E" + item.episode : ""}`.trim()}
                  </small>
                ) : null}
              </>
            ) : null}
          </div>
        );
        classNames += ` ${item.type.replace(" ", "-")} ${item.fullType}`;
        onClick = toggleExpanded;
        break;
      case "releaseDate":
        // Figure out if it's been released
        let d = new Date(unscuffDate(item.releaseDate));
        if (isNaN(d) || d > Date.now()) classNames += " unreleased";
        inside = item.releaseDate;
        break;
      default:
        inside = item[columnName];
    }
    return (
      <div
        key={item.id + columnName}
        className={columnName + " td " + classNames}
        onClick={onClick}
      >
        <div className="td-inner">{inside}</div>
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
            setShowFullCover={setShowFullCover}
          />
        ) : null}
      </div>
    </>
  );
}
