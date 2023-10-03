import React, { useState } from "react";
import { Icon } from "@mdi/react";
import { mdiVolumeHigh } from "@mdi/js";
import RowDetails from "@components/rowDetails/rowDetails";
import EpisodeNumber from "@components/episodeNumber";
import { imgAddress, Size, buildTvImagePath, searchFields } from "@/util";
import c from "./styles/row.module.scss";
import clsx from "clsx";

const highlightText = (
  text,
  indices,
  searchTextLength,
  highlightIndicesIndex, // undefined or index within indices array to highlight
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
  searchResultsHighlight,
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
        : null,
    );
  } else if (Array.isArray(searchTarget) && searchTarget.every((e) => typeof e === "string")) {
    return searchTarget.map((str, i) => {
      let columnItemResultIndex = rowSearchResults.findIndex(
        (e) => e.field === columnName && e.arrayIndex === i,
      );
      let columnItemResult = rowSearchResults[columnItemResultIndex];
      return highlightText(
        str,
        columnItemResult?.indices,
        searchTextLength,
        searchResultsHighlight && columnItemResultIndex === searchResultsHighlight.resultsOffset
          ? searchResultsHighlight.indicesIndex
          : null,
      );
    });
  } else if (searchTarget !== undefined) {
    console.error("Unknown field type (not string or array of strings)");
  }
};

export const ANIMATION_TIME = 180;

function Cell({ children, className, title, onClick }) {
  return (
    <div className={clsx(className, c.td)} onClick={onClick} title={title}>
      <div className={c.tdInner}>{children}</div>
    </div>
  );
}

export default React.memo(function Row({
  item,
  activeColumns,
  expanded,
  setExpanded,
  searchExpanded,
  searchResultsHighlight,
  rowSearchResults,
  searchText,
  collapseAdjacent,
  dataState,
  scrollToId,
  children,
}) {
  const [hideTvImage, setHideTvImage] = useState(false);

  const expand = () => {
    if (expanded) setExpanded(null);
    else {
      setExpanded(item._id);
    }
  };

  // For given text, returns JSX with highlighted search results
  const withSearch = (text, columnName) => {
    if (!searchExpanded || !rowSearchResults.length || !searchFields.includes(columnName))
      return text;
    return highlightSearchResults(
      text,
      columnName,
      rowSearchResults,
      searchText.length,
      searchResultsHighlight,
    );
  };

  return (
    <>
      <div
        className={`${c.standardRowInner} ${
          !activeColumns.includes("date") &&
          !activeColumns.includes("releaseDate") &&
          !activeColumns.includes("writer")
            ? c.compact
            : ""
        }`}
      >
        {activeColumns.includes("date") && (
          <Cell
            className={clsx(c.date, item.exactPlacementUnknown && c.exactPlacementUnknown)}
            title={item.exactPlacementUnknown && "exact placement currently unknown"}
          >
            {withSearch(item.date, "date")}
          </Cell>
        )}

        {activeColumns.includes("cover") && (
          <Cell
            className={clsx(c.cover, !item.cover && c.noCover)}
            title={item.cover ? item.title : ""}
          >
            {item.cover ? <img src={imgAddress(item.cover, Size.THUMB)} /> : null}
          </Cell>
        )}

        {activeColumns.includes("title") && (
          <Cell
            className={`${c.title} ${item.type} ${item.fullType}`}
            title={item.title}
            onClick={expand}
          >
            <div name="expand" tabIndex="0" onKeyDown={(e) => e.keyCode === 13 && expand()}>
              {children}
              {item.type === "tv" && item.series?.length ? (
                <>
                  {!hideTvImage ? (
                    <img
                      title={item.series[0]}
                      alt={item.series[0] + " logo"}
                      className={c.tvImage}
                      height="20"
                      src={buildTvImagePath(item.series[0])}
                      onError={() => setHideTvImage(true)}
                    />
                  ) : (
                    <small className={clsx(c.tvImage, c.textFallback)}>{item.series[0]}</small>
                  )}
                  <EpisodeNumber item={item}>
                    {highlightSearchResults(
                      item.se,
                      "se",
                      rowSearchResults,
                      searchText.length,
                      searchResultsHighlight,
                    )}
                  </EpisodeNumber>
                </>
              ) : null}
              {withSearch(item.title, "title")}
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
                      searchResultsHighlight,
                    )}
                  </EpisodeNumber>
                  {withSearch(item.collapseUntilTitle, "collapseUntilTitle")}
                </>
              ) : null}
              {item.audiobook && (
                <Icon
                  path={mdiVolumeHigh}
                  className={clsx("icon", c.audiobookIcon)}
                  title="audiobook"
                />
              )}
            </div>
          </Cell>
        )}

        {activeColumns.includes("writer") && (
          <Cell className={c.writer}>
            {item.writer?.length > 1 ? (
              <ul>
                {withSearch(item.writer, "writer").map((jsx, i) => (
                  <li key={i}>{jsx}</li>
                ))}
              </ul>
            ) : (
              withSearch(item.writer, "writer")
            )}
          </Cell>
        )}

        {activeColumns.includes("releaseDate") && (
          <Cell
            className={clsx(c.releaseDate, item.unreleased && c.unreleased)}
            title={item.unreleased && "unreleased"}
          >
            {withSearch(item.releaseDate, "releaseDate")}
          </Cell>
        )}
      </div>
      {expanded && <RowDetails item={item} dataState={dataState} />}
    </>
  );
});
