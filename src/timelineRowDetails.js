import { mdiNumeric } from "@mdi/js";
import React from "react";
import md5 from "md5";
import { CSSTransition } from "react-transition-group";

import WookieeLink from "./wookieeLink";
import ExternalLink from "./externalLink";

const imgAddress = (filename) => {
  // TODO add a "no cover" image
  if (!filename) return null;
  if (/^https?:\/\//.test(filename)) return filename;
  let hash = md5(filename);
  // TODO change to self hosting
  return `https://static.wikia.nocookie.net/starwars/images/${
    hash[0]
  }/${hash.slice(0, 2)}/${filename}`;
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
            {item.data.map((e) => (
              <li>{process(e, link)}</li>
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
    //arr.push("\u00A0");
  }
  //arr.pop();
  return arr;
};

const getData = (item) => {
  let type = "";
  switch (item.type) {
    case "book":
      type =
        (item.audience || "") +
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
  releaseDate = Array.isArray(item.releaseDate)
    ? [{ type: "list", data: item.releaseDate.map((e) => processDate(e)) }]
    : processDate(item.releaseDate);

  let ret = {
    Type: type,
    "Release date": process(releaseDate, false),
    Date: process(item.date),
    Author: process(item.author),
    Writer: process(item.writer),
    Penciler: process(item.penciller),
    Inker: process(item.inker),
    Letterer: process(item.letterer),
    Colorist: process(item.colorist),
    Publisher: process(item.publisher),
    Illustrator: process(item.illustrator),
    "Cover Artist": process(item.coverArtist),
    Pages: process(item.pages, false),
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

export const ANIMATION_TIME = 140;

export default function TimelineRowDetails({ expanded = true, item, colspan }) {
  const detailsRef = React.useRef();
  const detailsRowRef = React.useRef();

  React.useEffect(() => {
    if (detailsRef.current) {
      detailsRef.current.style.transition = "height " + ANIMATION_TIME + "ms";
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
      <tr className="details-row" ref={detailsRowRef}>
        <td colSpan={colspan}>
          <div className="details" ref={detailsRef}>
            <img
              /* height={260} */ width={200}
              src={imgAddress(item.cover)}
              className="cover"
              onLoad={imageLoaded}
            />
            <div className="text">
              <h3 className="title">
                <WookieeLink>{item.title}</WookieeLink>
              </h3>
              <dl>
                {Object.entries(getData(item)).map(([key, value]) => {
                  return (
                    <React.Fragment key={key}>
                      <dt>{key}:&nbsp;</dt>
                      <dd>{value}</dd>
                    </React.Fragment>
                  );
                })}
              </dl>
            </div>
          </div>
        </td>
      </tr>
    </CSSTransition>
  );
}
