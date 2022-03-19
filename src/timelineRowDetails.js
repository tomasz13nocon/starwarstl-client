import { mdiNumeric } from "@mdi/js";
import React from "react";
import md5 from "md5";
import { CSSTransition } from "react-transition-group";

import WookieeLink from "./wookieeLink";
import ExternalLink from "./externalLink";
import { Audience, imgAddress, Size } from "./common";

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
      type =
        (Audience[item.audience] || "") +
        "\u00A0" +
        (!item.audience || item.audience === "Young Reader" ? "book" : "novel");
      type = type.trim();
      break;
    case "comic":
      type = "Comic";
      switch (item.subtype) {
        case "Single issue":
          type += ", single issue";
          break;
        case "Series":
          type += " series";
          break;
        case "Story arc":
          type += ", story arc";
          break;
        case "Trade paperback":
          type += " (TPB)";
          break;
      }
      break;
    case "short story":
      type = "Short story";
      break;
    case "game":
      type = "Video game";
      break;
    case "tv":
      type = "TV series";
      switch (item.fullType) {
        case "tv-animated":
          type = "Animated TV series";
          break;
        case "tv-micro-series":
          type = "TV micro-series";
          break;
      }
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
  type = (
    <span
      className={`type-indicator ${item.type.replace(" ", "-")} ${
        item.fullType
      }`}
    >
      {type}
    </span>
  );

  let releaseDate;
  const processDate = (dateObj) => {
    if (!_.isObject(dateObj)) dateObj = { date: dateObj };
    let date = new Date(dateObj.date);
    if (isNaN(date)) {
      date = "Unknown";
    } else {
      // TODO: query for locale?
      date = date.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      });
    }
    let ret = [
      {
        type: "text",
        text: date,
      },
    ];
    if (dateObj.note) {
      ret[0].text += " ";
      ret.push({
        type: "note",
        text: dateObj.note,
      });
    }
    return ret;
  };
  // releaseDate = Array.isArray(item.releaseDateDetails)
  //   ? [
  //       {
  //         type: "list",
  //         data: item.releaseDateDetails.map((e) => processDate(e)),
  //       },
  //     ]
  //   : processDate(item.releaseDateDetails ?? item.releaseDate);

  let ret = {
    Type: type,
    "Release date": process(item.releaseDateDetails, false),
    Closed: process(item.closed),
    Chronology: process(item.dateDetails),
    Series: process(item.seriesDetails),
    Season: process(item.seasonDetails),
    Episode: process(item.episode),
    "Production No.": process(item.production),
    "Guest star(s)": process(item.guests),
    Developer: process(item.developer),
    Author: process(item.author),
    "Episode count": process(item.numEpisodes),
    "No. of seasons": process(item.numSeasons),
    "Network(s)": process(item.network),
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

export const ANIMATION_TIME = 150;

export default function TimelineRowDetails({
  expanded = true,
  item,
  setShowFullCover,
}) {
  const detailsRef = React.useRef();
  const detailsRowRef = React.useRef();

  React.useEffect(() => {
    if (detailsRef.current) {
      detailsRef.current.style.transition =
        "height " + ANIMATION_TIME + "ms ease-out"; //cubic-bezier(.36,.78,.64,.97)";
      detailsRef.current.style.height = expanded
        ? detailsRef.current.scrollHeight + "px"
        : 0;
    }
  }, [expanded]);

  const imageLoaded = () => {
    detailsRef.current.style.height = detailsRef.current.scrollHeight + "px";
  };

  return (
    <CSSTransition
      in={expanded}
      timeout={ANIMATION_TIME}
      classNames="slide"
      mountOnEnter
      unmountOnExit
      nodeRef={detailsRowRef}
    >
      <div className="tr details-row" ref={detailsRowRef}>
        <div className="td">
          <div
            className="details"
            ref={detailsRef}
            // style={{
            //   background: `linear-gradient(to left, transparent 50%, #f3f3f3bb, #f3f3f3), url(${imgAddress(
            //     item.cover, Size.FULL
            //   )})`,
            //   backgroundRepeat: "no-repeat",
            //   backgroundPosition: "right",
            //   backgroundSize: "500px",
            // }}
          >
            {item.cover ? (
              <img
                width={220}
                src={imgAddress(item.cover)}
                className="cover"
                onClick={() => setShowFullCover(item.cover)}
                onLoad={imageLoaded}
              />
            ) : null}
            <div className="text">
              <h3 className="title">
                <WookieeLink>{item.title}</WookieeLink>
              </h3>
              <dl>
                {Object.entries(getData(item)).map(([key, value]) => (
                  <React.Fragment key={key}>
                    <dt>{key}:&nbsp;</dt>
                    <dd>{value}</dd>
                  </React.Fragment>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </div>
    </CSSTransition>
  );
}
