import React from "react";
import { API } from "@/util";
import Legend from "./legend";
import Search from "./search";
import Table from "./table/table";
import Filters from "./filters/filters";
import TimelineRange from "./filters/timelineRange";
import TypeFilters from "./filters/typeFilters";
import MiscFilters from "./filters/miscFilters";
import ColumnSettings from "./filters/columnSettings";
import SortingMobile from "./filters/sortingMobile";
import BoxFilters from "./filters/boxFilters";
import filtersTemplate from "./filters/template";
import useSidebar from "@hooks/useSidebar";
import parseRange from "./parseRange";
import TextFilter from "./filters/textFilter";
import { initialSearchResults, searchResultsReducer } from "./searchResults";
import { typeFiltersInitializer, typeFiltersReducer } from "./typeFilters";
import AppearancesFilterSettings from "./filters/appearancesFilterSettings";
import { FiltersContext } from "./context";

export default function Timeline({ setFullCover }) {
  const [rawData, setRawData] = React.useState([]);
  const [seriesArr, setSeriesArr] = React.useState([]);
  const [filterText, setFilterText] = React.useState("");
  const [filterCategory, setFilterCategory] = React.useState("");
  const [suggestions, setSuggestions] = React.useState([]);
  const [boxFilters, setBoxFilters] = React.useState([]);
  const [timelineRangeBy, setTimelineRangeBy] = React.useState("date");
  const [hideUnreleased, setHideUnreleased] = React.useState(false);
  const [hideAdaptations, setHideAdaptations] = React.useState(false);
  const [collapseAdjacent, setCollapseAdjacent] = React.useState(false);
  const [showFilters, setShowFilters] = React.useState(false);
  const [dataState, setDataState] = React.useState("fetching"); // fetching, fetchingDetails, ok, error
  const [rangeFromStr, setRangeFrom] = React.useState("");
  const [rangeToStr, setRangeTo] = React.useState("");
  const [appearances, setAppearances] = React.useState({});
  const [appearancesFilters, setAppearancesFilters] = React.useState({
    hideMentions: false,
    hideIndirectMentions: false,
    hideFlashbacks: false,
    hideHolograms: false,
  });
  // Keys: names of columns corresponding to keys in data
  // Values: wheter they're to be displayed
  const [columns, setColumns] = React.useState({
    date: true,
    cover: false,
    title: true,
    writer: true,
    releaseDate: true,
  });
  const [searchExpanded, toggleSearchExpanded] = React.useReducer(
    (state, value) => (value === undefined ? !state : value),
    false
  );
  const [searchResults, dispatchSearchResults] = React.useReducer(
    searchResultsReducer,
    initialSearchResults
  );
  const [typeFilters, dispatchTypeFilters] = React.useReducer(
    typeFiltersReducer,
    filtersTemplate,
    (template) => {
      return typeFiltersInitializer(template);
    }
  );
  const [sorting, toggleSorting] = React.useReducer(
    (prevSorting, name) => {
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

  // Fetch data
  React.useEffect(async () => {
    let data,
      cancelled = false;
    const fetchToJson = async (apiRoute) => {
      let res = await fetch(API + apiRoute);
      if (!res.ok) throw new Error(res.statusText);
      return await res.json();
    };

    (async () => {
      try {
        // bare media
        let d = await fetchToJson("media");
        if (cancelled) return;

        // series data
        let s = await fetchToJson("series");
        if (cancelled) return;

        setRawData(d);
        setSeriesArr(s);

        // media details
        setDataState("fetchingDetails");
        data = await fetchToJson("media-details");
        if (cancelled) return;
      } catch (e) {
        setDataState("error");
        return;
      }

      setRawData(data);
      setDataState("ok");
    })();

    return () => (cancelled = true);
  }, []);

  useSidebar(setShowFilters);

  // Process timeline range input
  let rangeFrom = React.useMemo(
    () => parseRange(rangeFromStr, rawData, timelineRangeBy),
    [rangeFromStr, rawData, timelineRangeBy]
  );
  let rangeTo = React.useMemo(
    () => parseRange(rangeToStr, rawData, timelineRangeBy),
    [rangeToStr, rawData, timelineRangeBy]
  );

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
      <div className="timeline-container">
        {/* TODO context */}
        <FiltersContext.Provider value={""}>
          <Filters showFilters={showFilters} setShowFilters={setShowFilters}>
            <TextFilter
              filterText={filterText}
              setFilterText={setFilterText}
              seriesArr={seriesArr}
              suggestions={suggestions}
              setSuggestions={setSuggestions}
              boxFilters={boxFilters}
              setBoxFilters={setBoxFilters}
              filterCategory={filterCategory}
              setFilterCategory={setFilterCategory}
              appearances={appearances}
              setAppearances={setAppearances}
            />
            <BoxFilters boxFilters={boxFilters} setBoxFilters={setBoxFilters} />
            {filterCategory && (
              <AppearancesFilterSettings
                appearancesFilters={appearancesFilters}
                setAppearancesFilters={setAppearancesFilters}
              />
            )}
            <SortingMobile columns={columns} sorting={sorting} toggleSorting={toggleSorting} />
            <ColumnSettings columns={columns} setColumns={setColumns} />
            <MiscFilters
              hideUnreleased={hideUnreleased}
              setHideUnreleased={setHideUnreleased}
              hideAdaptations={hideAdaptations}
              setHideAdaptations={setHideAdaptations}
              collapseAdjacent={collapseAdjacent}
              setCollapseAdjacent={setCollapseAdjacent}
            />
            <TypeFilters
              typeFilters={typeFilters}
              filtersChanged={dispatchTypeFilters}
              filtersTemplate={filtersTemplate}
            />
            <TimelineRange
              timelineRangeBy={timelineRangeBy}
              setTimelineRangeBy={setTimelineRangeBy}
              rangeFrom={rangeFromStr}
              setRangeFrom={setRangeFrom}
              rangeTo={rangeToStr}
              setRangeTo={setRangeTo}
              fromValid={rangeFrom !== undefined}
              toValid={rangeTo !== undefined}
            />
          </Filters>
          <Table
            filterText={filterText}
            filterCategory={filterCategory}
            typeFilters={typeFilters}
            rawData={rawData}
            setFullCover={setFullCover}
            boxFilters={boxFilters}
            searchExpanded={searchExpanded}
            searchResults={searchResults}
            dispatchSearchResults={dispatchSearchResults}
            hideUnreleased={hideUnreleased}
            hideAdaptations={hideAdaptations}
            collapseAdjacent={collapseAdjacent}
            columns={columns}
            dataState={dataState}
            sorting={sorting}
            toggleSorting={toggleSorting}
            rangeFrom={rangeFrom}
            rangeTo={rangeTo}
            timelineRangeBy={timelineRangeBy}
            appearances={appearances}
            appearancesFilters={appearancesFilters}
          />
        </FiltersContext.Provider>
      </div>
    </main>
  );
}
