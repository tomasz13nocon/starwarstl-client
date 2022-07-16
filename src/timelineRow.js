import React from "react";
import Icon from "@mdi/react";
import { mdiVolumeHigh } from "@mdi/js";
import {
  imgAddress,
  Size,
  buildTvImagePath,
  unscuffDate,
  replaceInsensitive,
  escapeRegex,
} from "./common.js";
import { default as TimelineRowDetails } from "./timelineRowDetails";
import { CSSTransition } from "react-transition-group";

export const ANIMATION_TIME = 180;

export default React.memo(function TimelineRow({
  item,
  activeColumns,
  setFullCover,
  seriesArr,
  tvImages,
  setAnimating,
  expanded,
  setExpanded,
  searchExpanded,
  measure,
  searchResults,
  dispatchSearchResults,
}) {
  const [rowHeight, setRowHeight] = React.useState(0);
  let rowRef = React.useRef();
  React.useLayoutEffect(() => {
    setRowHeight(rowRef.current.clientHeight);
  }, []);

  const cells = React.useMemo(
    () =>
      activeColumns.map((columnName) => {
        let inside = item[columnName],
          classNames = "",
          onClick,
          title;
        // Search for highlighting
        // TODO put this in global scope/usecallback
        const highlightText = (
          text,
          indices,
          searchTextLength,
          highlightCurrent = false
        ) => {
          if (!indices) // No results for this field
            return text;
          let last = 0;
          return [
            ...indices.map((i) => {
              return (
                <React.Fragment key={i}>
                  {text.substring(last, i)}
                  <span
                    className={`highlight${highlightCurrent ? "-current" : ""}`}
                  >
                    {text.substring(i, (last = i + searchTextLength))}
                  </span>
                </React.Fragment>
              );
            }),
            text.substring(last, text.length),
          ];
        };

        if (searchExpanded && searchResults.results.length) {
          if (typeof item[columnName] === "string") {
            // since this field is a string, there is only one result object for it in the results array, therefore we use find, not filter, to find the indices
            inside = highlightText(
              item[columnName],
              searchResults.results.find(
                (e) => e.id === item._id && e.field === columnName
              )?.indices,
              searchResults.text.length
            );
          } else if (
            Array.isArray(item[columnName]) &&
            item[columnName].every((e) => typeof e === "string")
          ) {
            inside = item[columnName].map((str, i) =>
              highlightText(
                str,
                searchResults.results.find(
                  (e) =>
                    e.id === item._id &&
                    e.field === columnName &&
                    e.arrayIndex === i
                )?.indices,
                searchResults.text.length
              )
            );
          } else if (item[columnName] !== undefined) {
            console.error(
              "Unknown field type (not string or array of strings)"
            );
          }
        }

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
                  {inside.map((jsx, i) => (
                    <li key={i}>{jsx}</li>
                  ))}
                </ul>
              );
            }
            break;
          case "continuity":
            if (rowHeight && item.ongoingContinuity) {
              let lines = [];
              const strokeWidth = 8,
                currentStrokeWidth = strokeWidth + 2,
                cellWidth = 68 + 14;
              for (let [title, graph] of Object.entries(
                item.ongoingContinuity
              )) {
                // let xpos = 90 - graph.position * 10 + "%",
                let xpos =
                    cellWidth -
                    (currentStrokeWidth + 8) -
                    graph.position * strokeWidth +
                    "px",
                  x1,
                  x2,
                  x3,
                  x4,
                  y1,
                  y2,
                  y3,
                  y4;
                switch (graph.whichInSeries) {
                  case "first":
                    x1 = "100%";
                    x2 = xpos;
                    y1 = "50%";
                    y2 = "50%";
                    x3 = xpos;
                    x4 = xpos;
                    y3 = `${rowHeight / 2 - strokeWidth / 2}`;
                    y4 = "101%";
                    break;
                  case "middle":
                    x1 = x2 = xpos;
                    y1 = "-1%";
                    y2 = "101%";
                    break;
                  case "last":
                    x1 = xpos;
                    x2 = "100%";
                    y1 = "50%";
                    y2 = "50%";
                    x3 = xpos;
                    x4 = xpos;
                    y3 = "0%";
                    y4 = `${rowHeight / 2 + strokeWidth / 2}`;
                    break;
                  case "oneshot":
                    // TODO do this outside of this loop
                    break;
                }
                lines.push(
                  <line
                    key={title}
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke={graph.color}
                    strokeWidth={strokeWidth}
                  />
                );
                if (x3) {
                  lines.push(
                    <line
                      key={title + "_2"}
                      x1={x3}
                      y1={y3}
                      x2={x4}
                      y2={y4}
                      stroke={graph.color}
                      strokeWidth={strokeWidth}
                    />
                  );
                }
                if (item.series.includes(title)) {
                  lines.push(
                    <line
                      key={title + "_current"}
                      x1={cellWidth - currentStrokeWidth / 2}
                      y1={-1}
                      x2={cellWidth - currentStrokeWidth / 2}
                      y2={rowHeight + 1}
                      stroke={graph.color}
                      strokeWidth={currentStrokeWidth}
                    />
                  );
                }
              }
              inside = (
                <svg width="100%" height={rowHeight}>
                  {lines}
                </svg>
              );
            }
            break;
          case "title":
            // NOW adjust code below and elsewhere to the new search state format
            let last = 0;
            inside = (
              // TODO accessibility
              <div name="expand">
                {inside}
                {item.type === "tv" && item.series?.length ? (
                  <>
                    <img
                      // TODO: hover text
                      title={item.series}
                      alt={item.series}
                      className="tv-image"
                      height="16px"
                      src={buildTvImagePath(
                        item.series.find(
                          (e) =>
                            seriesArr.find((s) => s.title === e).type === "tv"
                        )
                      )} // TODO: This is horrendous
                    />
                    {item.season || item.episode ? (
                      <span
                        title={`${item.season ? `season ${item.season}` : ""}${
                          item.seasonNote ? ` ${item.seasonNote}` : ""
                        }${
                          item.episode ? `\nepisode ${item.episode}` : ""
                        }`.trim()}
                        className="season-episode"
                      >
                        {item.season && "S" + item.season}
                        <small>
                          {item.seasonNote && ` ${item.seasonNote}`}
                        </small>
                        {`${item.season && item.episode ? " " : ""}${
                          item.episode ? "E" + item.episode : ""
                        }`}
                      </span>
                    ) : null}
                  </>
                ) : null}
                {item.audiobook && (
                  <Icon
                    path={mdiVolumeHigh}
                    className="icon audiobook-icon"
                    title="audiobook"
                  />
                )}
              </div>
            );
            classNames += ` ${item.type} ${item.fullType}`;
            onClick = () => setExpanded(expanded ? null : item._id);
            break;
          case "releaseDate":
            // Figure out if it's been released
            let d = new Date(unscuffDate(item.releaseDate));
            if (isNaN(d) || d > Date.now()) {
              classNames += " unreleased";
              title = "unreleased";
            }
            break;
          case "date":
            if (item.exactPlacementUnknown) {
              classNames += " exact-placement-unknown";
              title = "exact placement currently unknown";
            }
            break;
        }
        return (
          <div
            key={item.id + columnName}
            className={columnName + " td " + classNames}
            onClick={onClick}
            title={title}
          >
            <div className="td-inner">{inside}</div>
          </div>
        );
      }),
    [
      activeColumns,
      item,
      expanded,
      setExpanded,
      rowHeight,
      searchResults.results, // TODO this should ideally be results array instead
      searchExpanded,
    ]
  );

  const detailsRef = React.useRef();
  React.useEffect(() => {
    if (detailsRef.current) {
      detailsRef.current.style.transition =
        "height " + ANIMATION_TIME + "ms ease-out"; //cubic-bezier(.36,.78,.64,.97)";
      detailsRef.current.style.height = expanded
        ? detailsRef.current.scrollHeight + "px"
        : 0;
    }
  }, [expanded]);
  const imageLoaded = React.useCallback(() => {
    detailsRef.current.style.height = detailsRef.current.scrollHeight + "px";
  }, []);

  const incAnim = React.useCallback(
    () => setAnimating((prev) => prev + 1),
    [setAnimating]
  );
  const decAnim = React.useCallback(
    () =>
      setAnimating((prev) => prev - 1) ||
      requestAnimationFrame(() => measure()), // raf is here, because on slow hardware the measure gets called before animation finishes, resulting in content being hidden.
    [setAnimating]
  );

  return (
    <>
      <div className="standard-row tr">
        <div className="standard-row-inner" ref={rowRef}>
          {cells}
        </div>
        <CSSTransition
          in={expanded}
          timeout={ANIMATION_TIME}
          classNames="slide"
          mountOnEnter
          unmountOnExit
          nodeRef={detailsRef}
          onEnter={incAnim}
          onEntered={decAnim}
          onExit={incAnim}
          onExited={decAnim}
        >
          <div className="tr details-row">
            <div className="td" ref={detailsRef}>
              <TimelineRowDetails
                item={item}
                setFullCover={setFullCover}
                imageLoaded={imageLoaded}
              />
            </div>
          </div>
        </CSSTransition>
      </div>
    </>
  );
});
