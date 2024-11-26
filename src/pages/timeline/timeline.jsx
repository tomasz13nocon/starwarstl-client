import { useEffect, useMemo, useReducer, useState } from "react";
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
import { useLocalStorage } from "@/hooks/useLocalStorage";
import Shell from "@layouts/shell";
import ListFilters from "./filters/listFilters";
import { useAuth } from "@/context/authContext";
import Button from "@components/button";
import SelectedActions from "./selectedActions";
import { useSwipeContext } from "@/context/swipeContext";
import CircleButton from "./circleButton";
import Icon from "@components/icon";
import { mdiArrowUp } from "@mdi/js";

function areAllBoolsFalse(obj) {
  return Object.values(obj).every((v) => (typeof v === "boolean" ? !v : areAllBoolsFalse(v)));
}

export default function Timeline() {
  const [rawData, setRawData] = useState([]);
  const [seriesArr, setSeriesArr] = useState([]);
  const [dataState, setDataState] = useState("fetching"); // fetching, fetchingDetails, ok, error
  const [filterText, setFilterText] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [boxFilters, setBoxFilters] = useLocalStorage("boxFilters", []);
  const [timelineRangeBy, setTimelineRangeBy] = useLocalStorage("timelineRangeBy", "date");
  const [hideUnreleased, setHideUnreleased] = useLocalStorage("hideUnreleased", false);
  const [hideAdaptations, setHideAdaptations] = useLocalStorage("hideAdaptations", false);
  const [collapseAdjacent, setCollapseAdjacent] = useLocalStorage("collapseAdjacent", false);
  const [showFilters, setShowFilters] = useState(false);
  const [rangeFromStr, setRangeFrom] = useLocalStorage("rangeFromStr", "");
  const [rangeToStr, setRangeTo] = useLocalStorage("rangeToStr", "");
  const [listFilters, setListFilters] = useLocalStorage("listFilters", []);
  const [appearances, setAppearances] = useState({});
  const [selected, setSelected] = useState(new Set());
  const pageIds = useMemo(
    () => new Set(rawData.map((i) => i.pageid).filter((p) => p != null)),
    [rawData],
  );
  const { fetchingAuth, user } = useAuth();
  const [appearancesFilters, setAppearancesFilters] = useLocalStorage("appearancesFilters", {
    hideMentions: false,
    hideIndirectMentions: false,
    hideFlashbacks: false,
    hideHolograms: false,
  });
  const [boxFiltersAnd, setBoxFiltersAnd] = useLocalStorage("boxFiltersAnd", false);
  // Keys: names of columns corresponding to keys in data
  // Values: wheter they're to be displayed
  const [columns, setColumns] = useLocalStorage(
    "columns",
    {
      selection: false,
      date: true,
      cover: false,
      title: true,
      releaseDate: true,
    },
    (prev) => {
      if (prev.selection === undefined) prev.selection = false;
      if (prev.writer !== undefined) delete prev.writer;
      return prev;
    },
  );
  const [searchExpanded, toggleSearchExpanded] = useReducer(
    (state, value) => (value === undefined ? !state : value),
    false,
  );
  const [searchResults, dispatchSearchResults] = useReducer(
    searchResultsReducer,
    initialSearchResults,
  );
  const [typeFilters, dispatchTypeFilters] = useReducer(
    typeFiltersReducer,
    filtersTemplate,
    (template) => {
      return typeFiltersInitializer(template);
    },
  );
  const [sorting, toggleSorting] = useReducer(
    (prevSorting, name) => {
      return {
        by: name,
        ascending: prevSorting.by === name ? !prevSorting.ascending : true,
      };
    },
    {
      by: "date",
      ascending: true,
    },
  );
  const { swiping } = useSwipeContext();

  useEffect(() => {
    // Remove list filters when logged out
    if (!fetchingAuth && !user) {
      setListFilters([]);
    }
  }, [fetchingAuth, user]);

  useEffect(() => {
    localStorage.setItem("typeFilters", JSON.stringify(typeFilters));
  }, [typeFilters]);

  // Fetch data
  useEffect(() => {
    let data,
      cancelled = false;
    const fetchToJson = async (apiRoute) => {
      const res = await fetch(API + apiRoute);
      if (!res.ok) throw new Error(res.statusText);
      return await res.json();
    };

    (async () => {
      try {
        // bare media
        const d = await fetchToJson("media?bare=true");
        if (cancelled) return;

        // series data
        const s = await fetchToJson("series");
        if (cancelled) return;

        setRawData(d);
        setSeriesArr(s);

        // media details
        setDataState("fetchingDetails");
        data = await fetchToJson("media");
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

  useSidebar(setShowFilters, swiping);

  // Process timeline range input
  const rangeFrom = useMemo(
    () => parseRange(rangeFromStr, rawData, timelineRangeBy),
    [rangeFromStr, rawData, timelineRangeBy],
  );
  const rangeTo = useMemo(
    () => parseRange(rangeToStr, rawData, timelineRangeBy),
    [rangeToStr, rawData, timelineRangeBy],
  );

  return (
    <Shell noMargin>
      <div className="circle-buttons">
        <CircleButton title="Scroll to top" onClick={() => window.scrollTo({ top: 0 })}>
          <Icon path={mdiArrowUp} size={1.5} />
        </CircleButton>
        <Legend />
        <Search
          expanded={searchExpanded}
          toggleExpanded={toggleSearchExpanded}
          searchResults={searchResults}
          dispatchSearchResults={dispatchSearchResults}
        />
        {selected.size > 0 && (
          <SelectedActions selected={selected} rawData={rawData} dataState={dataState} />
        )}
      </div>
      <div className="timeline-container">
        <Filters showFilters={showFilters} setShowFilters={setShowFilters}>
          <Button
            disabled={
              !(
                filterText ||
                boxFilters.length ||
                hideUnreleased ||
                hideAdaptations ||
                rangeFromStr ||
                rangeToStr ||
                !areAllBoolsFalse(typeFilters) ||
                listFilters.length
              )
            }
            onClick={() => {
              setFilterText("");
              setFilterCategory("");
              setBoxFilters([]);
              setHideUnreleased(false);
              setHideAdaptations(false);
              setTimelineRangeBy("date");
              setRangeFrom("");
              setRangeTo("");
              dispatchTypeFilters({ path: "type", to: false });
              setListFilters([]);
            }}
          >
            Reset all filters
          </Button>
          <TextFilter
            filterText={filterText}
            setFilterText={setFilterText}
            seriesArr={seriesArr}
            boxFilters={boxFilters}
            setBoxFilters={setBoxFilters}
            filterCategory={filterCategory}
            setFilterCategory={setFilterCategory}
            appearances={appearances}
            setAppearances={setAppearances}
          />
          <BoxFilters
            boxFilters={boxFilters}
            setBoxFilters={setBoxFilters}
            boxFiltersAnd={boxFiltersAnd}
            setBoxFiltersAnd={setBoxFiltersAnd}
          />
          {(filterCategory || boxFilters.some((box) => box.category)) && (
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
          {user ? (
            <ListFilters
              listFilters={listFilters}
              setListFilters={setListFilters}
              pageIds={pageIds}
              dataState={dataState}
            />
          ) : (
            ""
          )}
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
          boxFilters={boxFilters}
          boxFiltersAnd={boxFiltersAnd}
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
          listFilters={listFilters}
          appearances={appearances}
          appearancesFilters={appearancesFilters}
          selected={selected}
          setSelected={setSelected}
        />
      </div>
    </Shell>
  );
}
