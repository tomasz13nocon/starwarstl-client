import React from "react";
import { Icon } from "@mdi/react";
import { mdiVolumeHigh } from "@mdi/js";
import RowDetails from "@components/rowDetails";
import EpisodeNumber from "@components/episodeNumber";
import { imgAddress, Size, buildTvImagePath, searchFields } from "@/util";

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
          <span className={`highlight${highlightIndicesIndex === i ? "-current" : ""}`}>
            {text.substring(index, (last = index + searchTextLength))}
          </span>
        </React.Fragment>
      );
    }),
    text.substring(last, text.length),
  ];
};

const highlightSearchResults = (
  searchTarget,
  columnName,
  rowSearchResults,
  searchTextLength,
  searchResultsHighlight
) => {
  // Surely there's a better way to do this, but perfect is the enemy of good. And good is the enemy of working. *sigh*
  if (typeof searchTarget === "string") {
    // since this field is a string, there is only one result object for it in the results array, therefore we use find, not filter, to find the indices
    let columnResultIndex = rowSearchResults.findIndex((e) => e.field === columnName);
    let columnResult = rowSearchResults[columnResultIndex];
    return highlightText(
      searchTarget,
      columnResult?.indices,
      searchTextLength,
      searchResultsHighlight && columnResultIndex === searchResultsHighlight.resultsOffset
        ? searchResultsHighlight.indicesIndex
        : null
    );
  } else if (Array.isArray(searchTarget) && searchTarget.every((e) => typeof e === "string")) {
    return searchTarget.map((str, i) => {
      let columnItemResultIndex = rowSearchResults.findIndex(
        (e) => e.field === columnName && e.arrayIndex === i
      );
      let columnItemResult = rowSearchResults[columnItemResultIndex];
      return highlightText(
        str,
        columnItemResult?.indices,
        searchTextLength,
        searchResultsHighlight && columnItemResultIndex === searchResultsHighlight.resultsOffset
          ? searchResultsHighlight.indicesIndex
          : null
      );
    });
  } else if (searchTarget !== undefined) {
    console.error("Unknown field type (not string or array of strings)");
  }
};

export const ANIMATION_TIME = 180;

export default React.memo(function Row({
  item,
  activeColumns,
  setFullCover,
  expanded,
  setExpanded,
  searchExpanded,
  searchResultsHighlight,
  rowSearchResults,
  searchText,
  collapseAdjacent,
  dataState,
}) {
  // TODO: This might be a performance bottlneck. Cut down unnecessary calculations.
  const cells = activeColumns.map((columnName) => {
    let inside = item[columnName],
      classNames = "",
      onClick,
      title;

    // Search for highlighting
    if (searchExpanded && rowSearchResults.length && searchFields.includes(columnName)) {
      inside = highlightSearchResults(
        item[columnName],
        columnName,
        rowSearchResults,
        searchText.length,
        searchResultsHighlight
      );
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

      case "title": {
        let collapseUntilTitle = item.collapseUntilTitle;
        const expand = () => setExpanded(expanded ? null : item._id);
        if (searchExpanded && rowSearchResults.length && collapseAdjacent && collapseUntilTitle) {
          collapseUntilTitle = highlightSearchResults(
            collapseUntilTitle,
            "collapseUntilTitle",
            rowSearchResults,
            searchText.length,
            searchResultsHighlight
          );
        }
        inside = (
          <div name="expand" tabIndex="0" onKeyDown={(e) => e.keyCode === 13 && expand()}>
            {item.type === "tv" && item.series?.length ? (
              <>
                <img
                  title={item.series[0]}
                  alt={item.series[0]}
                  className="tv-image"
                  height="20px"
                  src={buildTvImagePath(item.series[0])}
                />
                <EpisodeNumber item={item}>
                  {highlightSearchResults(
                    item.se,
                    "se",
                    rowSearchResults,
                    searchText.length,
                    searchResultsHighlight
                  )}
                </EpisodeNumber>
              </>
            ) : null}
            {inside}
            {collapseAdjacent && item.collapseUntil ? (
              <>
                <br />
                <span>・・・</span>
                <br />
                <EpisodeNumber item={item.collapseUntil}>
                  {highlightSearchResults(
                    item.collapseUntil.se,
                    "collapseUntilSe",
                    rowSearchResults,
                    searchText.length,
                    searchResultsHighlight
                  )}
                </EpisodeNumber>
                {collapseUntilTitle}
              </>
            ) : null}
            {item.audiobook && (
              <Icon path={mdiVolumeHigh} className="icon audiobook-icon" title="audiobook" />
            )}
          </div>
        );
        classNames += ` ${item.type} ${item.fullType}`;
        onClick = expand;
        break;
      }

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
      <div
        className={`standard-row-inner ${
          !activeColumns.includes("date") &&
          !activeColumns.includes("releaseDate") &&
          !activeColumns.includes("writer")
            ? "compact"
            : ""
        }`}
      >
        {cells}
      </div>
      {expanded && <RowDetails item={item} setFullCover={setFullCover} dataState={dataState} />}
    </>
  );
});
