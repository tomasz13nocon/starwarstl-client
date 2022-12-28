import React from "react";
import { Icon } from "@mdi/react";
import { mdiVolumeHigh } from "@mdi/js";
import {
  imgAddress,
  Size,
  buildTvImagePath,
  searchFields,
} from "./common";
import TimelineRowDetails from "./timelineRowDetails";
import EpisodeNumber from "./episodeNumber";

const highlightText = (
  text,
  indices,
  searchTextLength,
  highlightIndicesIndex // undefined or index within indices array to highlight
) => {
  if (!indices)
    // No results for this field
    return text;
  let last = 0;
  return [
    ...indices.map((index, i) => {
      return (
        <React.Fragment key={index}>
          {text.substring(last, index)}
          <span className={`highlight${highlightIndicesIndex === i ? "-current" : "" }`}>
            {text.substring(index, (last = index + searchTextLength))}
          </span>
        </React.Fragment>
      );
    }),
    text.substring(last, text.length),
  ];
};

const highlightSearchResults = (searchTarget, columnName, rowSearchResults, searchTextLength, searchResultsHighlight) => {
  // Surely there's a better way to do this, but perfect is the enemy of good. And good is the enemy of working. *sigh*
  if (typeof searchTarget === "string") {
    // since this field is a string, there is only one result object for it in the results array, therefore we use find, not filter, to find the indices
    let columnResultIndex = rowSearchResults.findIndex(
      (e) => e.field === columnName
    );
    let columnResult = rowSearchResults[columnResultIndex];
    return highlightText(
      searchTarget,
      columnResult?.indices,
      searchTextLength,
      searchResultsHighlight && columnResultIndex === searchResultsHighlight.resultsOffset ? searchResultsHighlight.indicesIndex : null,
    );
  } else if (
    Array.isArray(searchTarget) &&
    searchTarget.every((e) => typeof e === "string")
  ) {
    return searchTarget.map((str, i) => {
      let columnItemResultIndex = rowSearchResults.findIndex(
        (e) => e.field === columnName && e.arrayIndex === i
      );
      let columnItemResult = rowSearchResults[columnItemResultIndex];
      return highlightText(
        str,
        columnItemResult?.indices,
        searchTextLength,
        searchResultsHighlight && columnItemResultIndex === searchResultsHighlight.resultsOffset ? searchResultsHighlight.indicesIndex : null,
      );
    });
  } else if (searchTarget !== undefined) {
    console.error(
      "Unknown field type (not string or array of strings)"
    );
  }
};

export const ANIMATION_TIME = 180;

export default React.memo(function TimelineRow({
  item,
  activeColumns,
  setFullCover,
  seriesArr,
  expanded,
  setExpanded,
  searchExpanded,
  searchResultsHighlight,
  rowSearchResults,
  searchText,
  collapseAdjacent,
  dataState,
}) {
  const [rowHeight, setRowHeight] = React.useState(0);
  let rowRef = React.useRef();
  React.useLayoutEffect(() => {
    setRowHeight(rowRef.current.clientHeight);
  }, []);

  // TODO: This might be a performance bottlneck. Cut down unnecessary calculations.
  const cells = activeColumns.map((columnName) => {
    let inside = item[columnName],
      classNames = "",
      onClick,
      title;

    // Search for highlighting
    if (
      searchExpanded &&
      rowSearchResults.length &&
      searchFields.includes(columnName)
    ) {
      inside = highlightSearchResults(item[columnName], columnName, rowSearchResults, searchText.length, searchResultsHighlight);
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
        let last = 0;
        let collapseUntilTitle = item.collapseUntilTitle;
        const expand = () => setExpanded(expanded ? null : item._id);
        if (searchExpanded && rowSearchResults.length && collapseAdjacent && collapseUntilTitle) {
          collapseUntilTitle = highlightSearchResults(collapseUntilTitle, "collapseUntilTitle", rowSearchResults, searchText.length, searchResultsHighlight);
        }
        inside = (
          // TODO accessibility
          <div name="expand" tabIndex="0" onKeyDown={(e) => e.keyCode === 13 && expand()}>
            {item.type === "tv" && item.series?.length ? (
              <>
                <img
                  // TODO: hover text
                  title={item.series[0]}
                  alt={item.series[0]}
                  className="tv-image"
                  height="20px"
                  src={buildTvImagePath(item.series[0])}
                />
                <EpisodeNumber item={item}>
                  {highlightSearchResults(item.se, "se", rowSearchResults, searchText.length, searchResultsHighlight)}
                </EpisodeNumber>
              </>
            ) : null}
            {inside}
            {collapseAdjacent && item.collapseUntil ?
              <>
                <br/>
                {/* ←{item.collapsedCount - 1} */}
                <span>・・・</span>
                <br/>
                <EpisodeNumber item={item.collapseUntil}>
                  {highlightSearchResults(item.collapseUntil.se, "collapseUntilSe", rowSearchResults, searchText.length, searchResultsHighlight)}
                </EpisodeNumber>
                {collapseUntilTitle}
              </>
              : null}
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
        onClick = expand;
        break;

      case "releaseDate":
        if (item.unreleased) {
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
  });

  return (
    <>
      {/* <div className="standard-row tr"> */}
      <div className={`standard-row-inner ${!activeColumns.includes("date") && !activeColumns.includes("releaseDate") && !activeColumns.includes("writer") ? "compact" : ""}`} ref={rowRef}>
        {cells}
      </div>
      {expanded &&
        <TimelineRowDetails
          item={item}
          setFullCover={setFullCover}
          dataState={dataState}
        />
      }
    </>
  );
});
