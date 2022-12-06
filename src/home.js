import produce from "immer";
import React from "react";
import { API, unscuffDate } from "./common.js";
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
        case "highlightPrev":
          // if no results or one result don't do anything
          if (
            !state.highlight ||
            (state.results.length === 1 &&
              state.results[0].indices.length === 1)
          ) {
            return state;
          } else {
            let newHighlight = {
              indicesIndex: state.highlight.indicesIndex,
              resultsIndex: state.highlight.resultsIndex,
              overallIndex: state.highlight.overallIndex - 1,
            };
            if (state.highlight.indicesIndex > 0) {
              newHighlight.indicesIndex--;
            } else if (state.highlight.resultsIndex > 0) {
              newHighlight.resultsIndex--;
              newHighlight.indicesIndex =
                state.results[newHighlight.resultsIndex].indices.length - 1;
            } else {
              newHighlight.resultsIndex = state.results.length - 1;
              newHighlight.indicesIndex =
                state.results[newHighlight.resultsIndex].indices.length - 1;
              newHighlight.overallIndex = state.overallSize;
            }
            return {
              text: state.text,
              highlight: newHighlight,
              results: state.results,
              overallSize: state.overallSize,
            };
          }
          break;
        case "highlightNext":
          // if no results or one result don't do anything
          if (
            !state.highlight ||
            (state.results.length === 1 &&
              state.results[0].indices.length === 1)
          ) {
            return state;
          } else {
            let newHighlight = {
              indicesIndex: state.highlight.indicesIndex,
              resultsIndex: state.highlight.resultsIndex,
              overallIndex: state.highlight.overallIndex + 1,
            };
            if (
              state.highlight.indicesIndex <
              state.results[state.highlight.resultsIndex].indices.length - 1
            ) {
              newHighlight.indicesIndex++;
            } else if (
              state.highlight.resultsIndex <
              state.results.length - 1
            ) {
              newHighlight.resultsIndex++;
              newHighlight.indicesIndex = 0;
            } else {
              newHighlight.resultsIndex = 0;
              newHighlight.indicesIndex = 0;
              newHighlight.overallIndex = 1;
            }
            return {
              text: state.text,
              highlight: newHighlight,
              results: state.results,
              overallSize: state.overallSize,
            };
          }
          break;
        case "setText":
          return {
            text: action.payload,
            highlight: state.highlight,
            results: state.results, // NOW: state updates. Should I infer parts of searchResults to improve perf? Does this matter? Is this the actual cause of the bug? prob not
            overallSize: state.overallSize,
          };
          break;
        case "setResults":
          let highlight;
          if (action.payload.results.length === 0 || state.text === "")
            // no results or empty search string -> reset highlight
            highlight = null;
          else {
            // TODO highlight the same thing if it was in previous results, also highlight from "current position" instead of from the start. Basically make this work the same as chrome's ctrl-f
            // Also clicking CHECK ALL scrolls unexpectedly
            // highlight = {
            //   globalIndex: 0,
            //   id: action.payload[0].id,
            //   field: action.payload[0].field,
            //   arrayIndex: action.payload[0].arrayIndex ?? -1,
            //   index: action.payload[0].indices[0],
            // };
            // if (highlight.index === undefined)
            //   throw "search index undefined, this should never happen";

            // highlight = 0;

            highlight = {
              overallIndex: 1,
              resultsIndex: 0,
              indicesIndex: 0,
            };
          }
          return {
            text: state.text,
            highlight: highlight,
            results: action.payload.results,
            overallSize: action.payload.overallSize,
          };
          break;
      }
    },
    { text: "", highlight: null, results: [], overallSize: 0 }
  );
  const timelineContainerRef = React.useRef();
  const [hideUnreleased, setHideUnreleased] = React.useState(false);

  React.useEffect(async () => {
    // TODO: show error on network error
    let res = await fetch(API + "media");
    if (!res.ok) {
      setErrorMsg("Failed to fetch data from the server.");
      console.error(res.status());
    }
    let data = await res.json();
    // Data preprocessing
    for (let item of data) {
      let d = new Date(unscuffDate(item.releaseDate));
      if (isNaN(d) || d > Date.now()) {
        item.unreleased = true;
      }
    }

    setRawData(data);

    res = await fetch(API + "series");
    // TODO: defer this possibly to first time user uses search
    setSeriesArr(await res.json());
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
          hideUnreleased={hideUnreleased}
          setHideUnreleased={setHideUnreleased}
          seriesArr={seriesArr}
        />
        {rawData.length && seriesArr.length ? (
          <Timeline
            filterText={filterText}
            filters={filters}
            rawData={rawData}
            seriesArr={seriesArr}
            setFullCover={setFullCover}
            setSuggestions={setSuggestions}
            boxFilters={boxFilters}
            searchExpanded={searchExpanded}
            searchResults={searchResults}
            dispatchSearchResults={dispatchSearchResults}
            hideUnreleased={hideUnreleased}
            setHideUnreleased={setHideUnreleased}
          />
        ) : (
          <Spinner />
        )}
      </div>
    </>
  );
}
