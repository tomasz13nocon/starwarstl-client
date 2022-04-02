import React from "react";
import Icon from "@mdi/react";
import { mdiVolumeHigh } from "@mdi/js";
import { imgAddress, Size, TV_IMAGE_PATH, unscuffDate } from "./common.js";
import { default as TimelineRowDetails } from "./timelineRowDetails";
import { CSSTransition } from "react-transition-group";

export const ANIMATION_TIME = 180;

export default React.memo(function TimelineRow({
  item,
  activeColumns,
  setShowFullCover,
  tvImages,
  setAnimating,
  expanded,
  setExpanded,
}) {
  const cells = React.useMemo(
    () =>
      activeColumns.map((columnName) => {
        let inside = item[columnName],
          classNames = "",
          onClick,
          title;
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
            classNames += ` ${item.type.replace(" ", "-")} ${item.fullType}`;
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
    [activeColumns, item, expanded, setExpanded]
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
    () => setAnimating((prev) => prev - 1),
    [setAnimating]
  );

  return (
    <>
      <div className="standard-row tr">
        {cells}
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
                setShowFullCover={setShowFullCover}
                imageLoaded={imageLoaded}
              />
            </div>
          </div>
        </CSSTransition>
      </div>
    </>
  );
});
