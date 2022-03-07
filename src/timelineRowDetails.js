import { mdiNumeric } from "@mdi/js";
import React from "react";
import md5 from "md5";
import { CSSTransition } from "react-transition-group";

import WookieeLink from "./wookieeLink";
import ExternalLink from "./externalLink";
import { Audience, SERVER, IMAGE_PATH } from "./common";

const imgAddress = (filename) => {
  // TODO add a "no cover" image
  if (!filename) return null;
  if (/^https?:\/\//.test(filename)) return filename;
  return `${IMAGE_PATH}${encodeURIComponent(filename)}`;
  // return `https://starwars.fandom.com/wiki/Special:FilePath/${filename}`;
  // let hash = md5(filename);
  // return `https://static.wikia.nocookie.net/starwars/images/${
  //   hash[0]
  // }/${hash.slice(0, 2)}/${filename}/revision/latest/scale-to-width-down/3000`;
};

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
          <ExternalLink href={item.site}>{item.text || item.site}</ExternalLink>
        );
        break;
      case "interwiki link":
        // wtf's support for this is weird and doesn't provide the acutal link
        // TODO:parser
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
    <span className={"type-indicator " + item.type.replace(" ", "-")}>
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
  releaseDate = Array.isArray(item.releaseDateDetails)
    ? [
        {
          type: "list",
          data: item.releaseDateDetails.map((e) => processDate(e)),
        },
      ]
    : processDate(item.releaseDateDetails ?? item.releaseDate);

  let ret = {
    Type: type,
    "Release date": process(releaseDate, false),
    Date: process(item.dateDetails),
    Author: process(item.author),
    Director: process(item.director),
    Writer: process(item.writerDetails),
    Producer: process(item.producer),
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
    Pages: process(item.pages, false),
    "Published in": process(item.publishedIn),
    Series: process(item.series),
    "Followed by": process(item.followedBy),
    "Preceded by": process(item.precededBy),
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

export default function TimelineRowDetails({ expanded = true, item }) {
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
            //     item.cover
            //   )})`,
            //   backgroundRepeat: "no-repeat",
            //   backgroundPosition: "right",
            //   backgroundSize: "500px",
            // }}
          >
            {item.cover ? (
              <img
                width={200}
                src={imgAddress(item.cover)}
                className="cover"
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
