import React from "react";
import produce from "immer";

import { API, imgAddress, Size } from "./common.js";
import Filters from "./filters.js";
import Legend from "./legend";
import Timeline from "./timeline.js";
import Spinner from "./spinner.js";

//import rawData from "./data.json";

const filtersTemplate = {
  type: {
    name: null,
    children: {
      book: {
        name: "Novels",
        children: {
          publisher: {
            name: "Publisher",
            children: {
              "Del Rey": true,
              "Disney–Lucasfilm Press": true,
              "Golden Books": true,
              "China Literature": true,
              "Random House Audio": true,
              Other: true,
            },
          },
          audience: {
            name: "Target audience",
            children: {
              a: { name: "Adult", value: true },
              ya: { name: "Young Adult", value: true },
              jr: { name: "Junior", value: false },
              Unknown: true,
            },
          },
          adaptation: {
            name: "Adaptations",
            value: false,
          },
        },
      },
      comic: {
        name: "Comics",
        children: {
          publisher: {
            name: "Publisher",
            children: {
              "Marvel Comics": true,
              "IDW Publishing": true,
              "Dark Horse Comics": true,
              Other: true,
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
      "short story": {
        name: "Short Stories",
        value: true,
      },
      film: {
        name: "Films",
        value: true,
      },
      tv: {
        name: "TV",
        value: true,
      },
      game: {
        name: "Video Games",
        value: true,
      },
      yr: {
        name: "Young Readers",
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
  const [showFullCover, setShowFullCover] = React.useState("");

  const [filters, dispatch] = React.useReducer(
    reducer,
    filtersTemplate,
    (filtersTemplate) => {
      return createState(filtersTemplate);
    }
  );

  const [rawData, setRawData] = React.useState([]);
  const [tvImages, setTvImages] = React.useState();

  React.useEffect(async () => {
    // TODO: show error on network error
    let res = await fetch(API + "media");
    setRawData(await res.json());
    res = await fetch(API + "tv-images");
    let json = await res.json();
    let dict = {};
    for (let item of json) {
      dict[item.series] = item.filename;
    }
    setTvImages(dict);
    return document.addEventListener(
      "keydown",
      (e) => {
        if (e.key === "Escape") setShowFullCover("");
      },
      false
    );
  }, []);

  return (
    <>
      {showFullCover === "" ? null : (
        <div
          className="full-image-container"
          onClick={() => setShowFullCover("")}
        >
          <img src={imgAddress(showFullCover, Size.FULL)} />
        </div>
      )}
      <Legend />
      <div className="timeline-container">
        <Filters
          filterText={filterText}
          filterTextChanged={setFilterText}
          filters={filters}
          filtersChanged={dispatch}
          filtersTemplate={filtersTemplate}
        />
        {rawData.length ? (
          <Timeline
            filterText={filterText}
            filters={filters}
            rawData={rawData}
            setShowFullCover={setShowFullCover}
            tvImages={tvImages}
          />
        ) : (
          <Spinner />
        )}
      </div>
    </>
  );
}
