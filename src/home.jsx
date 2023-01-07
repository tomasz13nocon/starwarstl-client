import { produce } from "immer";
import React from "react";
import { API, unscuffDate } from "./common";
import Filters from "./filters";
import FullCoverPreview from "./fullCoverPreview";
import Legend from "./legend";
import Search from "./search";
import Timeline from "./timeline";
import { useSwipeable } from "react-swipeable";
import { _ } from "lodash";

//import rawData from "./data.json";

const filtersTemplate = {
  type: {
    name: null,
    children: {
      film: {
        name: "Films",
        value: false,
      },
      tv: {
        name: "TV",
        children: {
          fullType: {
            name: "Type",
            children: {
              "tv-live-action": {
                name: "Live-action",
                value: false,
              },
              "tv-animated": {
                name: "Animated",
                value: false,
              },
              "tv-micro-series": {
                name: "Micro series",
                value: false,
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
                value: false,
              },
              "game-vr": {
                name: "VR",
                value: false,
              },
              "game-mobile": {
                name: "Mobile",
                value: false,
              },
              "game-browser": {
                name: "Browser",
                value: false,
              },
            },
          },
        },
      },
      book: {
        name: "Novels",
        children: {
          fullType: {
            name: "Target audience",
            children: {
              "book-a": { name: "Adult", value: false },
              "book-ya": { name: "Young Adult", value: false },
              "book-jr": { name: "Junior", value: false },
              // Unknown: false,
            },
          },
          // publisher: {
          //   name: "Publisher",
          //   children: {
          //     "Del Rey": false,
          //     "Disney–Lucasfilm Press": false,
          //     "Egmont UK Ltd": false,
          //     Other: false,
          //   },
          // },
          // adaptation: {
          //   name: "Adaptations",
          //   value: false,
          // },
        },
      },
      "audio-drama": {
        name: "Audio Dramas",
        value: false,
      },
      comic: {
        name: "Comics",
        children: {
          fullType: {
            name: "Type",
            children: {
              comic: {
                name: "Comic book",
                value: false,
              },
              "comic-manga": {
                name: "Manga",
                value: false,
              },
              "comic-strip": {
                name: "Comic strip",
                value: false,
              },
              "comic-story": {
                name: "Comic story",
                value: false,
              },
            },
          },
          // publisher: {
          //   name: "Publisher",
          //   children: {
          //     "Marvel Comics": false,
          //     "IDW Publishing": false,
          //     "Dark Horse Comics": false,
          //     "Egmont UK Ltd": false,
          //     Unknown: false,
          //   },
          // },
          // subtype: {
          //   name: "Format",
          //   children: {
          //     Series: false,
          //     "Story arc": false,
          //     "Single issue": false,
          //     "Trade paperback": false,
          //   },
          // },
        },
      },
      "short-story": {
        name: "Short Stories",
        value: false,
      },
      yr: {
        name: "Young Readers",
        value: false,
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

export default function Home({ setFullCover }) {
  ///// STATE /////
  const [sorting, toggleSorting] = React.useReducer(
    (prevSorting, name) => {
      // if (notSortable.includes(name)) return;
      return {
        by: name,
        ascending: prevSorting.by === name ? !prevSorting.ascending : true,
      };
    },
    {
      by: "date",
      ascending: true,
    }
  );
  const [filterText, setFilterText] = React.useState("");
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
  const [hideUnreleased, setHideUnreleased] = React.useState(false);
  const [collapseAdjacent, setCollapseAdjacent] = React.useState(false);
  // Keys: names of columns corresponding to keys in data
  // Values: wheter they're to be displayed
  const [columns, setColumns] = React.useState({
    date: true,
    cover: false,
    // continuity: false, // TODO: width of page, responsive, etc. AND oneshots AND only show when comics filtered AND background color of rows
    title: true,
    writer: true,
    releaseDate: true,
  });
  const [showFilters, setShowFilters] = React.useState(false);
  const [dataState, setDataState] = React.useState("fetching"); // fetching, fetchingDetails, ok, error
  /////////////////

  const timelineContainerRef = React.useRef();
  const filtersContainerRef = React.useRef();

  // for usage of useCallback see: https://stackoverflow.com/questions/64134566/should-we-use-usecallback-in-every-function-handler-in-react-functional-componen
  // useCallback is not about perf, it's about identity

  React.useEffect(async () => {
    let data, cancelled = false;
    const fetchToJson = async (apiRoute) => {
      let res = await fetch(API + apiRoute);
      if (!res.ok) throw new Error(res.statusText);
      return await res.json();
    }

    (async () => {
      try {
        // bare media
        setRawData(await fetchToJson("media"));
        if (cancelled) return;

        // series data
        setSeriesArr(await fetchToJson("series"));
        if (cancelled) return;

        // media details
        setDataState("fetchingDetails");
        data = await fetchToJson("media-details");
        if (cancelled) return;
      }
      catch (e) {
        setDataState("error");
      }

      // Data preprocessing
      for (let item of data) {
        let d = new Date(unscuffDate(item.releaseDate));
        if (isNaN(d) || d > Date.now()) {
          item.unreleased = true;
        }
      }
      setRawData(data);
      setDataState("ok");
    })();

    return () => cancelled = true;
  }, []);


  const { ref: documentRef } = useSwipeable({
    // onSwiping: (e) => {
    //   if (showFilters)
    //     filtersContainerRef.current.style.transform = `translateX(calc(${e.deltaX}px))`;
    //   else
    //     filtersContainerRef.current.style.transform = `translateX(calc(-100% + ${e.deltaX}px))`;
    // },
    onSwipedRight: (e) => {
      if (e.deltaX > 100) {
        setShowFilters(true);
      }
      // filtersContainerRef.current.style.removeProperty("transform");
    },
    onSwipedLeft: (e) => {
      if (e.deltaX < -100) {
        setShowFilters(false);
      }
      // filtersContainerRef.current.style.removeProperty("transform");
    },
  });
  React.useEffect(() => {
    documentRef(document);
    return () => documentRef({});
  });

  return (
    <main className="content">
      <div className="circle-buttons">
        <Legend />
        <Search
          expanded={searchExpanded}
          toggleExpanded={toggleSearchExpanded}
          searchResults={searchResults}
          dispatchSearchResults={dispatchSearchResults}
        />
      </div>
      <div className="timeline-container" ref={timelineContainerRef}>
        <Filters
          seriesArr={seriesArr}
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
          collapseAdjacent={collapseAdjacent}
          setCollapseAdjacent={setCollapseAdjacent}
          columns={columns}
          setColumns={setColumns}
          showFilters={showFilters}
          setShowFilters={setShowFilters}
          filtersContainerRef={filtersContainerRef}
          sorting={sorting}
          toggleSorting={toggleSorting}
        />
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
          collapseAdjacent={collapseAdjacent}
          columns={columns}
          dataState={dataState}
          sorting={sorting}
          toggleSorting={toggleSorting}
        />
      </div>
    </main>
  );
}
