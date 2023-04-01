export const initialSearchResults = { text: "", highlight: null, results: [], overallSize: 0 };

// #overengineered
export function searchResultsReducer(state, action) {
  switch (action.type) {
    case "highlightPrev":
      // if no results or one result don't do anything
      if (
        !state.highlight ||
        (state.results.length === 1 && state.results[0].indices.length === 1)
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
          newHighlight.indicesIndex = state.results[newHighlight.resultsIndex].indices.length - 1;
        } else {
          newHighlight.resultsIndex = state.results.length - 1;
          newHighlight.indicesIndex = state.results[newHighlight.resultsIndex].indices.length - 1;
          newHighlight.overallIndex = state.overallSize;
        }
        return {
          text: state.text,
          highlight: newHighlight,
          results: state.results,
          overallSize: state.overallSize,
        };
      }
    case "highlightNext":
      // if no results or one result don't do anything
      if (
        !state.highlight ||
        (state.results.length === 1 && state.results[0].indices.length === 1)
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
        } else if (state.highlight.resultsIndex < state.results.length - 1) {
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
    case "setText":
      return {
        text: action.payload,
        highlight: state.highlight,
        results: state.results,
        overallSize: state.overallSize,
      };
    case "setResults": {
      let highlight;
      if (action.payload.results.length === 0 || state.text === "")
        // no results or empty search string -> reset highlight
        highlight = null;
      else {
        // TODO highlight the same thing if it was in previous results, also highlight from "current position" instead of from the start.
        // Basically make this work the same as chrome's ctrl-f
        // Also clicking CHECK ALL scrolls unexpectedly
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
    }
  }
}
