import React from "react";
import wtf from "wtf_wikipedia";
import { decode } from "html-entities";

import TimelineRowDetails from "./timelineRowDetails.js";
import Error from "./error.js";
import Spinner from "./spinner.js";
import "./styles/add.scss";

const extend = () => {
  wtf.extend((models, templates) => {
    let parse = models.parse;

    templates.c = (tmpl, list) => {
      let x = parse(tmpl, ["value"]);
      list.push({ template: "C", value: x.value });
      return `((${x.value}))`;
    };

    // Ignore quotes found at the begining of articles so that the first paragraph is the actual article
    templates.quote = (tmpl, list) => {
      list.push(parse(tmpl, ["text", "author"]));
      return "";
    };

    templates["scroll box"] = (tmpl, list) => {
      console.log(parse(tmpl));
      //list.push({ template: "Scroll Box", value: wtf(tmpl) });
      return tmpl;
    };
  });
};
extend();

/* const fetchWookiee = title => wtf.fetch(title, {
	domain: "starwars.fandom.com",
	path: "api.php",
	// TODO uncomment and add proper info
	//userAgent: 'tomasz13nocon@gmail.com'
}); */
// Caching version for dev
const fetchWookiee = async (title) => {
  const apiUrl = `https://starwars.fandom.com/api.php?action=query&prop=revisions&titles=${encodeURIComponent(
    title
  )}&rvprop=content&format=json&rvslots=main&origin=*&maxage=86400`;
  const resp = await fetch(apiUrl);
  const json = await resp.json();
  return wtf(Object.values(json.query.pages)[0].revisions?.[0].slots.main["*"]);
};

// Returns a promise resolving to a target audience string from wtf doc
// TODO for Disney LF press books link to https://books.disney.com/?s=${title} for ppl to confirm age range
const getAudience = async (doc) => {
  let categories = doc.categories();
  if (categories.includes("Canon adult novels")) return "Adult";
  if (categories.includes("Canon young-adult novels")) return "Young Adult";
  let sentence = doc.sentence(0).text();
  //let mediaType = doc.infobox().get("media type").text();
  const reg = (str) => {
    let yr = /young[ -]reader/i;
    let jr = /junior/i;
    let ya = /young[ -]adult/i;
    let a = /adult|canon novel/i;
    if (yr.test(str)) return "Young Readers";
    if (jr.test(str)) return "Junior";
    if (ya.test(str)) return "Young Adult";
    if (a.test(str)) return "Adult";
    return null;
  };
  let regSentence = reg(sentence);
  if (regSentence) return regSentence;
  let seriesTitle;
  try {
    seriesTitle = doc.infobox().get("series").links()[0].json().page;
  } catch (e) {
    console.log(
      "Couldn't get a 'series' from infobox.",
      e.name + ":",
      e.message
    );
    return null;
  }
  let seriesSentence = (await fetchWookiee(seriesTitle)).sentence(0).text();
  return reg(seriesSentence);
};

// Returns "yyyy-mm-dd" from a date string
const normalizeDate = (str) => {
  let date = new Date(str);
  return `${date.getFullYear()}-${(date.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
};

// Takes a text node, returns an array of text and note nodes.
// If no notes in text, the array contains just the text node.
// If text node has an empty note and nothing else: "(())" returns empty array
const processNotes = (textNode) => {
  let nodes = [];
  let matches = textNode.text.split(/\(\((.*?)\)\)/);
  for (let [i, match] of matches.entries()) {
    if (match) {
      // note
      if (i % 2) {
        nodes.push({ ...textNode, type: "note", text: match });
      }
      // text
      else if (match.trim()) {
        nodes.push({ ...textNode, text: match.trim() });
      }
    }
  }
  return nodes;
};

const process = (sentence) => {
  if (!sentence) return sentence;
  console.log(sentence.text(), sentence.ast());

  // What follows is a rather nasty code that reads lists from the sentence's ast.
  // Ideally we would get this from the parser, but doing this in wtf_wikipedia would be even harder and nastier.
  let newAst = [],
    list = [],
    listItem = [],
    current = newAst; // What we're pushing to (the new AST or a list item inside of it)
  for (let [i, astNode] of sentence.ast().entries()) {
    astNode = _.mapValues(astNode, (e) =>
      typeof e === "string" ? decode(e) : e
    );
    // If it's not a text node, just push
    if (astNode.type !== "text") {
      // TODO delete unwanted properties. Like "raw" on links
      current.push(astNode);
      continue;
    }

    // PSEUDO CODE
    /*
		Special case for first line starting with a star
			open list

		Loop through \n occurences
			If followed by *
				add preceding text to current
				If current is list
					add new list item to list
				Else
					open list
			Else // not followed by *
				If current is list
					add preceding text to current
					close list
				Else // current is not list
					concat preceding text with compunding text
			*/

    // When a list is at the beginning the star isn't preceded by \n
    if (i === 0 && astNode.text.startsWith("*")) {
      // Start a list
      listItem = [];
      list = [listItem];
      current = listItem;
      newAst.push({ type: "list", data: list });
      astNode.text = astNode.text.replace(/^\*+/, "");
    }

    let lines = astNode.text.split(/\n/);
    // No newlines, just push and go next
    if (lines.length === 1) {
      //if (astNode.text)
      current.push(...processNotes(astNode));
      continue;
    }
    let preceding;
    for (let line of lines) {
      // Skip the first iteration, since we need to operate on data from 2 consecutive iterations
      if (preceding) {
        //if (preceding.text)
        current.push(...processNotes(preceding));

        if (line.startsWith("*")) {
          if (current === listItem) {
            // Append new list item
            listItem = [];
            current = listItem;
            list.push(listItem);
          } else {
            // Start a list
            listItem = [];
            current = listItem;
            list = [listItem];
            newAst.push({ type: "list", data: list });
          }
        } else {
          // line doesn't start with a *
          if (current === listItem) {
            current = astNode;
          } else {
            // Concatenate consecutive text nodes (not absolutely necessary, we can just have them next to each other)
            console.error("Not implemented");
          }
        }
      }
      // remove the leading stars (and spaces)
      preceding = { ...astNode, text: line.replace(/^\*+ */, "") };
    }
    // Add the last line
    //if (preceding.text)
    current.push(...processNotes(preceding));
  }

  console.log(newAst);
  // If there's just one text node return its text.
  return newAst.length === 1 && newAst[0].type === "text"
    ? newAst[0].text
    : newAst;
};

// This component hard codes a lot of data values. This is fine since this is the only place where we add them. If we end up needing them elsewhere, rewrite to abstract them away.
export default function Add() {
  const [titleOrLink, setTitleOrLink] = React.useState("Master & Apprentice");
  const [data, setData] = React.useState();
  const [isFetching, setIsFetching] = React.useState(false);
  // Fetching/parsing error message
  const [error, setError] = React.useState();

  /** Set error message, hide loading spinner */
  const showError = (msg) => {
    setError(msg);
    setIsFetching(false);
  };

  const submit = (e) => {
    e.preventDefault();
  };

  const fetchAndParse = async () => {
    setData(null);
    setError(null);
    setIsFetching(true);

    // Extract the title from the link
    let title = titleOrLink;
    try {
      let url = new URL(title);
      let linkMatch = url.pathname.match(/\/wiki\/(.*)/);
      if (url.hostname !== "starwars.fandom.com" || linkMatch === null) {
        showError("This link doesn't seem to be a correct Wookieepedia link.");
        return;
      }
      title = decodeURIComponent(linkMatch[1].replace(/_/g, " "));
    } catch (e) {
      /* Not a url, proceed with `title` as a title */
    }

    console.log(title);
    let doc = await fetchWookiee(title);
    console.log(doc);

    if (doc._wiki === "") {
      showError(
        "There doesn't seem to be anything there. Please check that you've entered the correct title or link."
      );
      return;
    }

    // Check for canon status
    console.log(doc.templates());
    let isCanon = doc
      .templates()
      .find((t) => t.data.template === "top")
      ?.data.list.includes("can");
    if (!isCanon) {
      // TODO add a mention of legends
      // TODO should this be a warning? canonicity seems to be implied.
      showError("This article doesn't seem to refer to canon media.");
      return;
    }

    let infobox = doc.infobox();
    if (!infobox) {
      // This is a disambiguation page. Their formatting is unpredictable so we have to ask for a direct link.
      if (doc.templates().find((item) => item.template === "disambig")) {
        showError(
          "There are multiple articles with this title. Please enter the link."
        );
        return;
      }
      showError(
        "This wookieepedia article has unknown format. Are you sure you've entered a title or link of a media item? If so, please enter the data manually."
      );
      // TODO send the title of this entry to the database or email or sth.
      return;
    }

    let type, subtype;
    // It hurts the eyes a little to see capitalized and non capitalized values next to each other but the reason for this is the filter structure explained in home.js `createState` function.
    console.log(infobox._type);
    switch (infobox._type) {
      case "book":
        type = "book";
        break;
      case "book series":
        type = "book";
        subtype = "Series";
        break;
      case "audiobook":
        type = "audiobook";
        break;
      case "comic book":
      case "comic strip":
      case "webstrip":
      case "comic story":
        type = "comic";
        subtype = "Single issue";
        break;
      case "comic story arc":
        type = "comic";
        subtype = "Story arc";
        break;
      case "comic series":
        type = "comic";
        subtype = "Series";
        break;
      case "trade paperback":
        type = "comic";
        subtype = "Trade paperback";
        break;
      case "short story":
        type = "short story";
        break;
      case "reference book":
        type = "reference book";
        break;
      case "video game":
        type = "video game";
        break;
      case "movie":
        type = "movie";
        break;
      case "television series":
        type = "tv";
        subtype = "series";
        break;
      case "television season":
        type = "tv";
        subtype = "season";
        break;
      case "television episode":
        type = "tv";
        subtype = "episode";
        break;
      //case "media":
    }

    let draft = {
      type: type,
      subtype: subtype,
      title: title,
      audience: type === "book" ? await getAudience(doc) : null,
      cover: infobox
        .get("image")
        ?.text()
        .match(/\[\[File:(.*)\]\]/)[1],
      //series: infobox.get("series")?.text(),
      precededBy: infobox.get("preceded by")?.text(),
      followedBy: infobox.get("followed by")?.text(),
    };
    console.log(infobox.get("followed by"));

    // These properties can have multiple values
    for (const [key, value] of Object.entries({
      releaseDate: infobox.get("release date"),
      author: infobox.get("author"),
      publisher: infobox.get("publisher"),
      pages: infobox.get("pages"),
      isbn: infobox.get("isbn"),
      coverArtist: infobox.get("cover artist"),
      date: infobox.get("timeline"),
      illustrator: infobox.get("illustrator"),
      editor: infobox.get("editor"),
      mediaType: infobox.get("media type"),
      series: infobox.get("series"),
    })) {
      draft[key] = process(value);
    }

    // Delete empty values
    for (const [key, value] of Object.entries(draft)) {
      value ?? delete draft[key];
    }

    console.log(draft);

    let rawDate = draft.releaseDate;
    if (rawDate) {
      if (typeof rawDate === "string") {
        // This happens only when the date is all plain text (without links, notes) which doesn't seem to be the case ever
        draft.releaseDate = { date: normalizeDate(rawDate) };
      } else if (Array.isArray(rawDate)) {
        // This should always be the case
        const processDate = (item) => {
          let text = item
            .filter((e) => e.type === "text" || e.type.includes("link"))
            .reduce((acc, e) => (acc += e.text || e.page), "");
          let obj = { date: normalizeDate(text) };
          let note = item.find((e) => e.type === "note");
          if (note) obj.note = note.text;
          return obj;
        };
        if (rawDate[0]) {
          draft.releaseDate =
            rawDate[0].type === "list"
              ? rawDate[0].data.map((e) => processDate(e))
              : processDate(rawDate);
        }
      }
    }

    setData(draft);

    // TODO check wookieepedia timeline for the placement of this entry

    setIsFetching(false);
    console.log(`Fetched ${title}`);
  };

  return (
    <div className="add-container">
      <h1>Submit a new entry</h1>
      <h2>
        Start by entering a title of the Wookieepedia article or a link to that
        article
      </h2>
      <button onClick={() => console.log(data)}>test</button>
      <button onClick={extend}>Extend wtf</button>
      <button
        onClick={async () =>
          console.log(await wtf.fetch("Alexander_Howard,_Viscount_Andover"))
        }
      >
        wikipedia
      </button>

      <form onSubmit={submit}>
        <label>
          Wookieepedia title or link:{" "}
          <input
            type="text"
            value={titleOrLink}
            onChange={(e) => setTitleOrLink(e.target.value)}
          />
        </label>
        <input type="button" value="Fetch" onClick={fetchAndParse} />
        <br />
        <hr />

        <h3>Timeline placement</h3>
        <label>
          Media that directly precedes this: <input type="text" />
        </label>
        <hr />

        <h3>Information</h3>
        <label>
          Type:{" "}
          <select>
            <option value="book">Novel/Book</option>
            <option value="comic">Comic book</option>
          </select>
        </label>

        <br />
        <input type="submit" value="Submit" />
      </form>
      {error ? <Error>{error}</Error> : null}
      {isFetching ? <Spinner /> : null}
      {data && !isFetching ? (
        <table>
          <tbody>
            <TimelineRowDetails item={data}></TimelineRowDetails>
          </tbody>
        </table>
      ) : null}
    </div>
  );
}
