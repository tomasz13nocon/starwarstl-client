import React from "react";
import { Blurhash } from "react-blurhash";
import { _ } from "lodash";
import WookieeLink from "@components/wookieeLink";
import ExternalLink from "@components/externalLink";
import MessageImg from "@components/messageImg";
import Ellipsis from "@components/ellipsis";
import { imgAddress } from "@/util";

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
          </ul>
        );
        break;
      case "note":
        arr.push(<small className="note">({item.text})</small>);
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
          </ExternalLink>
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

export default React.memo(function RowDetails({ item, setFullCover, dataState }) {
  return (
    <div className="tr details-row">
      <div className="td">
        {dataState === "fetchingDetails" ? (
          <MessageImg img="jediTexts">
            Accessing sacred Jedi texts
            <Ellipsis />
          </MessageImg>
        ) : (
          <>
            {item.cover ? (
              <button
                className="reset-button cover-button"
                onClick={() =>
                  setFullCover({
                    name: item.cover,
                    show: true,
                    width: item.coverWidth,
                    height: item.coverHeight,
                    hash: item.coverHash,
                  })
                }
              >
                <Blurhash
                  hash={item.coverHash}
                  width={220}
                  height={220 / (item.coverWidth / item.coverHeight)}
                />
                <img
                  key={Math.random()}
                  width={220}
                  src={imgAddress(item.cover)}
                  alt={`cover of ${item.title}`}
                  className={`cover`}
                />
              </button>
            ) : null}
            <div className="text">
              <h2 className="title">
                <WookieeLink>{item.title}</WookieeLink>
              </h2>
              <dl>
                {Object.entries(getData(item)).map(([key, value]) => (
                  <React.Fragment key={key}>
                    <dt>{key}:&nbsp;</dt>
                    <dd>{value}</dd>
                  </React.Fragment>
                ))}
              </dl>
            </div>
          </>
        )}
      </div>
    </div>
  );
});
