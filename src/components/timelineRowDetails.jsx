import React from "react";
import { Blurhash } from "react-blurhash";
import { _ } from "lodash";
import WookieeLink from "@components/wookieeLink";
import ExternalLink from "@components/externalLink";
import MessageImg from "@components/messageImg";
import Ellipsis from "@components/ellipsis";
import { imgAddress } from "@/util";

const process = (value, link = true) => {
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
              <li key={i}>{process(e, link)}</li>
            ))}
          </ul>
        );
        //for (let e of item.data) {
        //arr.push(...process(e, link));
        //arr.push(<br />);
        //}
        //arr.pop();
        break;
      case "note":
        arr.push(<small className="note">({item.text})</small>);
        break;
      case "internal link":
        arr.push(item.text || item.page);
        arr.push(link && <WookieeLink title={item.page} />);
        break;
      case "external link":
        arr.push(
          <ExternalLink href={item.site}>{item.text ?? item.site}</ExternalLink>
        );
        break;
      case "interwiki link":
        arr.push(
          <ExternalLink
            href={"https://" + item.href}
            title={`${item.wiki}: ${item.page}`}
          >
            {item.text ?? item.page}
          </ExternalLink>
        );
        break;
    }
  }

  // We can safely use indices as keys since this is static content.
  return arr.map((el, i) => <React.Fragment key={i}>{el}</React.Fragment>);
};

const getData = (item) => {
  let type = "";
  switch (item.type) {
    case "book":
      type = "Novel";
      break;
    case "comic":
      type = "Comic";
      break;
    case "short-story":
      type = "Short story";
      break;
    case "audio-drama":
      type = "Audio drama";
      break;
    case "game":
      type = "Video game";
      break;
    case "tv":
      type = "TV series";
      break;
    case "film":
      type = "Film";
      break;
    case "yr":
      type = "Young Reader";
      break;
    default:
      type = "Unknown";
  }

  switch (item.fullType) {
    case "book-a":
      type = "Novel";
      break;
    case "book-ya":
      type = "Young adult novel";
      break;
    case "book-jr":
      type = "Junior novel";
      break;
    case "game-vr":
      type = "VR game";
      break;
    case "game-mobile":
      type = "Mobile game";
      break;
    case "game-browser":
      type = "Browser game";
      break;
    case "tv-animated":
      type = "Animated TV series";
      break;
    case "tv-micro-series":
      type = "Micro-series";
      break;
    case "comic-story":
      type = "Comic story";
      break;
    case "comic-strip":
      type = "Comic strip";
      break;
    case "comic-manga":
      type = "Manga";
      break;
  }

  if (item.audiobook) type += " (audiobook)";

  type = (
    <span className={`type-indicator ${item.type} ${item.fullType}`}>
      {type}
    </span>
  );

  let ret = {
    Type: type,
    "Timeline notes": process(item.timelineNotes),
    "Release date": process(item.releaseDateDetails, false),
    "Last aired": process(item.lastAired, false), // TODO: first aired when availible instead of release date?
    Closed: process(item.closed, false),
    Chronology: process(item.dateDetails),
    Series: process(item.seriesDetails),
    Season: process(item.seasonDetails),
    Episode: process(item.episode),
    "Production No.": process(item.production),
    "Episode count": process(item.numEpisodes),
    "No. of seasons": process(item.numSeasons),
    "Network(s)": process(item.network),
    // "askldjsalkd": "break",
    "Guest star(s)": process(item.guests),
    Developer: process(item.developer),
    Author: process(item.author),
    "Creator(s)": process(item.creators),
    "Director(s)": process(item.director),
    "Writer(s)": process(item.writerDetails),
    Producer: process(item.producer),
    "Executive producer(s)": process(item.executiveProducers),
    Starring: process(item.starring),
    Music: process(item.music),
    Runtime: process(item.runtime),
    Budget: process(item.budget),
    Language: process(item.language),
    Penciler: process(item.penciller),
    Inker: process(item.inker),
    Letterer: process(item.letterer),
    Colorist: process(item.colorist),
    Publisher: process(item.publisherDetails),
    Illustrator: process(item.illustrator),
    "Cover Artist": process(item.coverArtist),
    "Published in": process(item.publishedIn),
    Pages: process(item.pages, false),
    "Game engine": process(item.engine),
    Genre: process(item.genre),
    Modes: process(item.modes),
    "Rating(s)": process(item.ratings),
    "Platform(s)": process(item.platforms),
    "Base game": process(item.basegame),
    Expansions: process(item.expansions),
    Designer: process(item.designer),
    Programmer: process(item.programmer),
    Artist: process(item.artist),
    Composer: process(item.composer),
    "Issue number": process(item.issue),
    "Followed by": process(item.followedBy ?? item.next),
    "Preceded by": process(item.precededBy ?? item.prev),
    UPC: process(item.upc, false),
    ISBN: process(item.isbn, false),
  };
  for (const [key, value] of Object.entries(ret)) {
    //value ?? delete ret[key];
    if (_.isEmpty(value)) delete ret[key];
  }
  return ret;
};

export default React.memo(function TimelineRowDetails({
  item,
  setFullCover,
  dataState,
}) {
  return (
    <div className="tr details-row">
      <div className="td">
        {dataState === "fetchingDetails" ?
          <MessageImg img="jediTexts">
            Accessing sacred Jedi texts<Ellipsis />
          </MessageImg>
          :
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
                }>
                <Blurhash hash={item.coverHash} width={220} height={220 / (item.coverWidth / item.coverHeight)} />
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
              {/* {item.timelineNotes && ( */}
              {/*   <ul className="timeline-notes"> */}
              {/*     {item.timelineNotes.map((note, i) => ( */}
              {/*       <li className="timeline-note" key={i}> */}
              {/*         {note} */}
              {/*       </li> */}
              {/*     ))} */}
              {/*   </ul> */}
              {/* )} */}
              <dl>
                {Object.entries(getData(item)).map(([key, value]) => (
                  <React.Fragment key={key}>
                    {/* {value === "break" ? <div className="divider"></div> :  */}
                    {/* <> */}
                    <dt>{key}:&nbsp;</dt>
                    <dd>{value}</dd>
                    {/* </> */}
                    {/* } */}
                  </React.Fragment>
                ))}
              </dl>
            </div>
          </>
        }
      </div>
    </div>
  );
});
