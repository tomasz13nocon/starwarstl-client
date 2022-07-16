import produce from "immer";
import React from "react";
import { API } from "./common.js";
import Filters from "./filters.js";
import FullCoverPreview from "./fullCoverPreview.js";
import Legend from "./legend";
import Search from "./search";
import Error from "./error";
import Spinner from "./spinner.js";
import Timeline from "./timeline.js";

//import rawData from "./data.json";

const filtersTemplate = {
  type: {
    name: null,
    children: {
      book: {
        name: "Novels",
        children: {
          fullType: {
            name: "Target audience",
            children: {
              "book-a": { name: "Adult", value: true },
              "book-ya": { name: "Young Adult", value: true },
              "book-jr": { name: "Junior", value: true },
              // Unknown: true,
            },
          },
          publisher: {
            name: "Publisher",
            children: {
              "Del Rey": true,
              "Disney–Lucasfilm Press": true,
              "Egmont UK Ltd": true,
              Other: true,
            },
          },
          // adaptation: {
          //   name: "Adaptations",
          //   value: false,
          // },
        },
      },
      yr: {
        name: "Young Readers",
        value: true,
      },
      comic: {
        name: "Comics",
        children: {
          fullType: {
            name: "Type",
            children: {
              comic: {
                name: "Comic book",
                value: true,
              },
              "comic-strip": {
                name: "Comic strip",
                value: true,
              },
              "comic-story": {
                name: "Comic story",
                value: true,
              },
              "comic-manga": {
                name: "Manga",
                value: true,
              },
            },
          },
          publisher: {
            name: "Publisher",
            children: {
              "Marvel Comics": true,
              "IDW Publishing": true,
              "Dark Horse Comics": true,
              "Egmont UK Ltd": true,
              Unknown: true,
            },
          },
          // subtype: {
          //   name: "Format",
          //   children: {
          //     Series: true,
          //     "Story arc": true,
          //     "Single issue": true,
          //     "Trade paperback": false,
          //   },
          // },
        },
      },
      "short-story": {
        name: "Short Stories",
        value: true,
      },
      tv: {
        name: "TV",
        children: {
          fullType: {
            name: "Type",
            children: {
              "tv-live-action": {
                name: "Live-action",
                value: true,
              },
              "tv-animated": {
                name: "Animated",
                value: true,
              },
              "tv-micro-series": {
                name: "Micro series",
                value: true,
              },
            },
          },
        },
      },
      game: {
        name: "Video Games",
        children: {
          fullType: {
            name: "Platform",
            children: {
              game: {
                name: "Desktop/console",
                value: true,
              },
              "game-vr": {
                name: "VR",
                value: true,
              },
              "game-mobile": {
                name: "Mobile",
                value: true,
              },
              "game-browser": {
                name: "Browser",
                value: true,
              },
            },
          },
        },
      },
      "audio-drama": {
        name: "Audio Dramas",
        value: true,
      },
      film: {
        name: "Films",
        value: true,
      },
    },
  },
};

const _createStateFrom = (obj) => {
  if (!obj) throw "Incorrect template structure!";
  let ret = {};
  for (const [key, value] of Object.entries(obj)) {
    ret[key] =
      typeof value === "boolean"
        ? value
        : value.value !== undefined
        ? value.value
        : _createStateFrom(value.children || value);
    // value.value - object representing a single filter
    // value.children - standard structure
    // value - object with direct children
  }
  return ret;
};

// template is an object containing the recursive structure of the filters.
// This template can also contain values useful for e.g. rendering.
// It needs to have the following structure:
// keys correspond to data's keys.
// values can be one of:
// A boolean representing a single filter
// An object with a "value" key representing a single filter
// An object without a "value" key representing a nested group of filters
//    Such an object can have a "children" key with a value being an object
//    containing the main structure recursively
//    or follow the main structure itself.
// Wheter you use "children" and "value" keys depends on if you want to include other data
// for a filter or group to be used later (when rendering). The 2 approaches can be mixed freely.
const createState = (template) => {
  try {
    return _createStateFrom(template);
  } catch (e) {
    throw e instanceof RangeError
      ? "Incorrect template structure! (infinite recursion)"
      : e;
  }
};

const _setChildren = (children, to) => {
  for (let [key, value] of Object.entries(children)) {
    if (typeof value === "boolean") {
      children[key] = to;
    } else {
      _setChildren(value, to);
    }
  }
};

const reducer = (state, { path, to }) => {
  return produce(state, (draft) => {
    let atPath = _.get(draft, path);
    typeof atPath === "boolean"
      ? _.set(draft, path, to)
      : _setChildren(atPath, to);
  });
};

export default function Home() {
  const [filterText, setFilterText] = React.useState("");
  const [fullCover, setFullCover] = React.useState({ name: "", show: false });
  const [filters, dispatch] = React.useReducer(
    reducer,
    filtersTemplate,
    (filtersTemplate) => {
      return createState(filtersTemplate);
    }
  );
  const [rawData, setRawData] = React.useState([]);
  const [seriesArr, setSeriesArr] = React.useState([]);
  const [tvImages, setTvImages] = React.useState();
  const [suggestions, setSuggestions] = React.useState([]);
  const [boxFilters, setBoxFilters] = React.useState([]);
  const [errorMsg, setErrorMsg] = React.useState("");
  const [searchExpanded, toggleSearchExpanded] = React.useReducer(
    (state, value) => (value === undefined ? !state : value),
    false
  );
  const [searchResults, dispatchSearchResults] = React.useReducer(
    (state, action) => {
      switch (action.type) {
        case "highlightPrev": // TODO both of these
          return {
            highlight:
              state.highlight > 0
                ? state.highlight - 1
                : state.results.length - 1,
            results: state.results,
          };
          break;
        case "highlightNext":
          return {
            highlight:
              state.highlight < state.results.length - 1
                ? state.highlight + 1
                : 0,
            results: state.results,
          };
          break;
        case "setText":
          return {
            text: action.payload,
            highlight: state.highlight,
            results: state.results,
          };
          break;
        case "setResults":
          let highlight;
          if (action.payload.length === 0 || state.text === "")
            // no results or empty search string -> reset highlight
            highlight = null;
          else {
            // TODO highlight the same thing if it was in previous results, also highlight from "current position" instead of from the start
            highlight = {
              globalIndex: 0,
              id: action.payload[0].id,
              field: action.payload[0].field,
              arrayIndex: action.payload[0].arrayIndex ?? -1,
              index: action.payload[0].indices[0],
            };
            if (highlight.index === undefined)
              throw "search index undefined, this should never happen";
          }
          return {
            text: state.text,
            highlight: highlight,
            results: action.payload,
          };
          break;
      }
    },
    { text: "", highlight: null, results: [] }
  );
  const timelineContainerRef = React.useRef();

  React.useEffect(async () => {
    // TODO: show error on network error
    let res = await fetch(API + "media");
    if (!res.ok) {
      setErrorMsg("Failed to fetch data from the server.");
      console.error(res.status());
    }
    setRawData(await res.json());
    res = await fetch(API + "series");
    // TODO: defer this possibly to first time user uses search
    setSeriesArr(await res.json());
    res = await fetch(API + "tv-images");
    let json = await res.json();
    let dict = {};
    for (let item of json) {
      dict[item.series] = item.filename;
    }
    setTvImages(dict);
  }, []);

  return (
    <>
      <FullCoverPreview fullCover={fullCover} setFullCover={setFullCover} />
      <div className="circle-buttons">
        <Legend />
        <Search
          expanded={searchExpanded}
          toggleExpanded={toggleSearchExpanded}
          searchResults={searchResults}
          dispatchSearchResults={dispatchSearchResults}
        />
      </div>
      <Error>{errorMsg}</Error>
      <div className="timeline-container" ref={timelineContainerRef}>
        <Filters
          filterText={filterText}
          filterTextChanged={setFilterText}
          filters={filters}
          filtersChanged={dispatch}
          filtersTemplate={filtersTemplate}
          suggestions={suggestions}
          setSuggestions={setSuggestions}
          boxFilters={boxFilters}
          setBoxFilters={setBoxFilters}
          timelineContainerRef={timelineContainerRef}
        />
        {rawData.length && seriesArr.length ? (
          <Timeline
            filterText={filterText}
            filters={filters}
            rawData={rawData}
            seriesArr={seriesArr}
            setFullCover={setFullCover}
            tvImages={tvImages}
            setSuggestions={setSuggestions}
            boxFilters={boxFilters}
            searchExpanded={searchExpanded}
            searchResults={searchResults}
            dispatchSearchResults={dispatchSearchResults}
          />
        ) : (
          <Spinner />
        )}
      </div>
    </>
  );
}
