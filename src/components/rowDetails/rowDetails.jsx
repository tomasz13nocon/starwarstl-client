import React, { useContext, useReducer, useState } from "react";
import { Icon } from "@mdi/react";
import {
  mdiChevronDown,
  mdiChevronUp,
  mdiClock,
  mdiClockOutline,
  mdiClockPlusOutline,
  mdiClockRemove,
  mdiClockRemoveOutline,
  mdiEye,
  mdiEyeOutline,
  mdiEyePlusOutline,
  mdiEyeRemove,
  mdiStarOutline,
} from "@mdi/js";
import _ from "lodash";
import WookieeLink from "@components/wookieeLink";
import ExternalLink from "@components/externalLink";
import Fetching from "@components/inlineAlerts/fetching";
import Appearances from "./appearances";
import AppearancesSettings from "./appearancesSettings";
import { AppearancesContext } from "./context";
import { AnalyticsCategories, analytics } from "@/analytics";
import MediaCover from "@components/mediaCover";
import c from "./styles/rowDetails.module.scss";
import * as api from "@/fetch";
import { useAuth } from "@/context/authContext";
import Spinner from "@components/spinner";
import LoginDialog from "@layouts/loginDialog";
import clsx from "clsx";
import { ToastContext } from "@/context/toastContext";

const render = (value, link = true) => {
  if (!Array.isArray(value)) return value;
  // Else it's an AST
  let arr = [];
  for (let item of value) {
    switch (item.type) {
      case "text":
        arr.push(item.text);
        break;
      case "list":
        arr.push(
          <ul>
            {item.data.map((e, i) => (
              <li key={i}>{render(e, link)}</li>
            ))}
          </ul>,
        );
        break;
      case "note":
        arr.push(<small className={c.note}>({item.text})</small>);
        break;
      case "internal link":
        arr.push(item.text || item.page);
        arr.push(link && <WookieeLink title={item.page} />);
        break;
      case "external link":
        arr.push(<ExternalLink href={item.site}>{item.text ?? item.site}</ExternalLink>);
        break;
      case "interwiki link":
        arr.push(
          <ExternalLink href={"https://" + item.href} title={`${item.wiki}: ${item.page}`}>
            {item.text ?? item.page}
          </ExternalLink>,
        );
        break;
    }
  }

  // We can safely use indices as keys since this is static content.
  return arr.map((el, i) => <React.Fragment key={i}>{el}</React.Fragment>);
};

const types = {
  book: "Novel",
  comic: "Comic",
  "short-story": "Short story",
  "audio-drama": "Audio drama",
  game: "Video game",
  tv: "TV series",
  film: "Film",
  yr: "Young Reader",
};
const fullTypes = {
  "book-a": "Novel",
  "book-ya": "Young adult novel",
  "book-jr": "Junior novel",
  "game-vr": "VR game",
  "game-mobile": "Mobile game",
  "game-browser": "Browser game",
  "tv-animated": "Animated TV series",
  "tv-micro-series": "Micro-series",
  "comic-story": "Comic story",
  "comic-strip": "Comic strip",
  "comic-manga": "Manga",
};

const getData = (item) => {
  let type = fullTypes[item.fullType] ?? types[item.type] ?? "Unknown";
  if (item.audiobook) type += " (audiobook)";
  type = <span className={`type-indicator ${item.type} ${item.fullType}`}>{type}</span>;

  let ret = {
    Type: type,
    "Timeline notes": render(item.timelineNotes),
    "Release date": render(item.releaseDateDetails, false),
    "Last aired": render(item.lastAired, false), // TODO: first aired when availible instead of release date?
    Closed: render(item.closed, false),
    Chronology: render(item.dateDetails),
    Series: render(item.seriesDetails),
    Season: render(item.seasonDetails),
    Episode: render(item.episode),
    "Production No.": render(item.production),
    "Episode count": render(item.numEpisodes),
    "No. of seasons": render(item.numSeasons),
    "Network(s)": render(item.network),
    "Guest star(s)": render(item.guests),
    Developer: render(item.developer),
    Author: render(item.author),
    "Creator(s)": render(item.creators),
    "Director(s)": render(item.director),
    "Writer(s)": render(item.writerDetails),
    Producer: render(item.producer),
    "Executive producer(s)": render(item.executiveProducers),
    Starring: render(item.starring),
    Music: render(item.music),
    Runtime: render(item.runtime),
    Budget: render(item.budget),
    Language: render(item.language),
    Penciler: render(item.penciller),
    Inker: render(item.inker),
    Letterer: render(item.letterer),
    Colorist: render(item.colorist),
    Publisher: render(item.publisherDetails),
    Illustrator: render(item.illustrator),
    "Cover Artist": render(item.coverArtist),
    "Published in": render(item.publishedIn),
    Pages: render(item.pages, false),
    "Game engine": render(item.engine),
    Genre: render(item.genre),
    Modes: render(item.modes),
    "Rating(s)": render(item.ratings),
    "Platform(s)": render(item.platforms),
    "Base game": render(item.basegame),
    Expansions: render(item.expansions),
    Designer: render(item.designer),
    Programmer: render(item.programmer),
    Artist: render(item.artist),
    Composer: render(item.composer),
    "Issue number": render(item.issue),
    "Followed by": render(item.followedBy ?? item.next),
    "Preceded by": render(item.precededBy ?? item.prev),
    UPC: render(item.upc, false),
    ISBN: render(item.isbn, false),
  };
  for (const [key, value] of Object.entries(ret)) {
    if (_.isEmpty(value)) delete ret[key];
  }
  return ret;
};

function HoverIcon({ path, hoverPath, ...props }) {
  const [hover, setHover] = useState(false);
  return (
    <Icon
      {...props}
      path={hover ? hoverPath : path}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    />
  );
}

const icons = {
  addToWatched: mdiEye,
  addToWatchlist: mdiClock,
  removeFromWatched: mdiEyeRemove,
  removeFromWatchlist: mdiClockRemove,
};
const notifications = {
  addToWatched: "Added to watched",
  addToWatchlist: "Added to watchlist",
  removeFromWatched: "Removed from watched",
  removeFromWatchlist: "Removed from watchlist",
};
const iconClass = {
  addToWatched: c.toastIconAdd,
  addToWatchlist: c.toastIconAdd,
  removeFromWatched: c.toastIconRemove,
  removeFromWatchlist: c.toastIconRemove,
};

export default React.memo(function RowDetails({ item, dataState }) {
  const [appearancesVisible, toggleAppearancesVisible] = useReducer((s) => !s, false);
  const [hideMentions, toggleHideMentions] = useReducer((s) => !s, false);
  const [hideIndirectMentions, toggleHideIndirectMentions] = useReducer((s) => !s, false);
  const [hideFlashbacks, toggleHideFlashbacks] = useReducer((s) => !s, false);
  const [hideHolograms, toggleHideHolograms] = useReducer((s) => !s, false);
  const { fetching, user, setUser } = useAuth();
  const { pushToast } = useContext(ToastContext);

  async function listAction(action, id) {
    await api[action](id);
    pushToast({
      title: notifications[action],
      description: (
        <div className={c.toastDescription}>
          <Icon className={clsx("icon", iconClass[action])} path={icons[action]} size={1} />
          <span className={clsx(item.fullType, c.toastItemTitle)}>{item.title}</span>
        </div>
      ),
    });
  }

  async function addToWatched(id) {
    await listAction("addToWatched", id);
    setUser((prev) => ({
      ...prev,
      lists: { ...prev.lists, watched: [...prev.lists.watched, id] },
    }));
  }
  async function addToWatchlist(id) {
    await listAction("addToWatchlist", id);
    setUser((prev) => ({
      ...prev,
      lists: { ...prev.lists, watchlist: [...prev.lists.watchlist, id] },
    }));
  }
  async function removeFromWatched(id) {
    await listAction("removeFromWatched", id);
    setUser((prev) => ({
      ...prev,
      lists: { ...prev.lists, watched: prev.lists.watched.filter((e) => e !== id) },
    }));
  }
  async function removeFromWatchlist(id) {
    await listAction("removeFromWatchlist", id);
    setUser((prev) => ({
      ...prev,
      lists: { ...prev.lists, watchlist: prev.lists.watchlist.filter((e) => e !== id) },
    }));
  }

  return (
    <article className={c.tr}>
      <div className={c.td}>
        {dataState === "fetchingDetails" ? (
          <Fetching />
        ) : (
          <>
            <div className={c.tdInner}>
              {item.cover ? (
                <MediaCover
                  src={item.cover}
                  alt={`Cover of ${item.title}`}
                  width={item.coverWidth}
                  height={item.coverHeight}
                  hash={item.coverHash}
                />
              ) : null}
              <div className={c.text}>
                <h2 className={c.title}>
                  {item.redlink ? (
                    item.title
                  ) : (
                    <WookieeLink title={item.href ?? item.title}>{item.title}</WookieeLink>
                  )}
                </h2>

                <div className={c.actions}>
                  {fetching ? (
                    <Spinner />
                  ) : user ? (
                    <>
                      <div className={c.listBtns}>
                        {user.lists.watched.includes(item.pageid) ? (
                          <button onClick={() => removeFromWatched(item.pageid)}>
                            <HoverIcon
                              className={clsx("icon", c.watched)}
                              path={mdiEye}
                              hoverPath={mdiEyeRemove}
                              size={1.5}
                            />
                          </button>
                        ) : (
                          <button onClick={() => addToWatched(item.pageid)}>
                            <HoverIcon
                              className="icon"
                              path={mdiEyeOutline}
                              hoverPath={mdiEyePlusOutline}
                              size={1.5}
                            />
                          </button>
                        )}
                        {user.lists.watchlist.includes(item.pageid) ? (
                          <button onClick={() => removeFromWatchlist(item.pageid)}>
                            <HoverIcon
                              className={clsx("icon", c.watchlist)}
                              path={mdiClock}
                              hoverPath={mdiClockRemove}
                              size={1.5}
                            />
                          </button>
                        ) : (
                          <button onClick={() => addToWatchlist(item.pageid)}>
                            <HoverIcon
                              className="icon"
                              path={mdiClockOutline}
                              hoverPath={mdiClockPlusOutline}
                              size={1.5}
                            />
                          </button>
                        )}
                      </div>
                    </>
                  ) : (
                    <LoginDialog className={clsx("btn", c.signInBtn)}>
                      Sign in to perform actions
                    </LoginDialog>
                  )}
                </div>

                {item.notUnique && item.title !== item.href && (
                  <div className={c.notUnique}>
                    Appearances and information (other than Timeline notes) refer to &quot;
                    {item.href}&quot;
                  </div>
                )}

                <dl>
                  {Object.entries(getData(item)).map(([key, value]) => (
                    <React.Fragment key={key}>
                      <dt>{key}:&nbsp;</dt>
                      <dd>{value}</dd>
                    </React.Fragment>
                  ))}
                </dl>

                <div className={c.spacer} />

                <div className={c.bottomBtns}>
                  {item.hasAppearances && (
                    <div className={c.appearancesBtnWrapper}>
                      <button
                        className={`btn ${appearancesVisible ? "active" : ""} ${c.appearancesBtn}`}
                        onClick={() => {
                          toggleAppearancesVisible(true);
                          if (!appearancesVisible) {
                            analytics.logEvent(
                              AnalyticsCategories.appearances,
                              "Show appearances click",
                              item.title,
                            );
                          }
                        }}
                      >
                        <span>{appearancesVisible ? "Hide appearances" : "Show appearances"}</span>
                        <Icon
                          className="icon"
                          path={appearancesVisible ? mdiChevronUp : mdiChevronDown}
                        />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
            {appearancesVisible && (
              <AppearancesContext.Provider
                value={{
                  hideMentions,
                  toggleHideMentions,
                  hideIndirectMentions,
                  toggleHideIndirectMentions,
                  hideFlashbacks,
                  toggleHideFlashbacks,
                  hideHolograms,
                  toggleHideHolograms,
                }}
              >
                <AppearancesSettings />
                <Appearances id={item._id} />
              </AppearancesContext.Provider>
            )}
          </>
        )}
      </div>
    </article>
  );
});
