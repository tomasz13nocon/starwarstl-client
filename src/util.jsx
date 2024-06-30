import {
  mdiAccount,
  mdiCat,
  mdiRobot,
  mdiCalendar,
  mdiEarth,
  mdiMapMarker,
  mdiMedal,
  mdiShape,
  mdiFamilyTree,
  mdiSpaceStation,
  mdiSwordCross,
  mdiChip,
} from "@mdi/js";

export const API = (import.meta.env.VITE_API_HOST ?? "") + "/api/";
export const IMAGE_PATH = (import.meta.env.VITE_IMG_HOST ?? "") + "/img/covers/";
export const TV_IMAGE_PATH = `/img/tv-images/thumb/`;
export const ERA_IMAGE_PATH = `/img/eras/`;
export const Audience = Object.freeze({
  a: "Adult",
  ya: "Young Adult",
  jr: "Junior",
});

export const Size = Object.freeze({
  THUMB: "thumb/",
  MEDIUM: "medium/",
  SMALL: "small/",
  FULL: "full/",
});
export const searchFields = [
  "title",
  "writer",
  "releaseDate",
  "date",
  "collapseUntilTitle",
  "se",
  "collapseUntilSe",
];
// Column names which aren't meant to be sorted by
export const notSortable = ["cover"];
export const columnNames = {
  date: "Date",
  continuity: "Continuity",
  cover: "Cover",
  title: "Title",
  writer: "Writer",
  releaseDate: "Release Date",
};
export const suggestionPriority = [
  "film",
  "tv-live-action",
  "game",
  "tv-animated",
  "multimedia",
  "book-a",
  "book-ya",
  "comic",
  "comic-manga",
  "audio-drama",
  "game-vr",
  "book-jr",
  "tv-micro-series",
  "comic-strip",
  "comic-story",
  "game-mobile",
  "short-story",
  "yr",
  "game-browser",
  "unknown",
];

export const appearancesCategoriesNames = {
  // "dramatis personae": "Dramatis personae",
  // "other characters": "Other characters",
  // characters: "Characters",
  // creatures: "Creatures",
  // droids: "Droids",
  // events: "Events",
  // locations: "Locations",
  // organizations: "Organizations",
  // species: "Species",
  // vehicles: "Vehicles",
  // technology: "Technology",
  // miscellanea: "Miscellanea",
  // "l-dramatis personae": "Dramatis personae",
  // "l-other characters": "Other characters",
  // "l-characters": "Characters",
  // "l-creatures": "Creatures",
  // "l-droids": "Droids",
  // "l-events": "Events",
  // "l-locations": "Locations",
  // "l-organizations": "Organizations",
  // "l-species": "Species",
  // "l-vehicles": "Vehicles",
  // "l-technology": "Technology",
  // "l-miscellanea": "Miscellanea",
  // "c-dramatis personae": "Dramatis personae",
  // "c-other characters": "Other characters",
  // "c-characters": "Characters",
  // "c-creatures": "Creatures",
  // "c-droids": "Droids",
  // "c-events": "Events",
  // "c-locations": "Locations",
  // "c-organizations": "Organizations",
  // "c-species": "Species",
  // "c-vehicles": "Vehicles",
  // "c-technology": "Technology",
  // "c-miscellanea": "Miscellanea",
  "dramatis personae": "Dramatis personae",
  "other characters": "Other characters",
  characters: "Characters",
  creatures: "Creatures",
  droids: "Droid models",
  events: "Events",
  locations: "Locations",
  organizations: "Organizations and titles",
  species: "Sentient species",
  vehicles: "Vehicles and vessels",
  technology: "Weapons and technology",
  miscellanea: "Miscellanea",
  "l-dramatis personae": "Dramatis personae",
  "l-other characters": "Other characters",
  "l-characters": "Characters",
  "l-creatures": "Creatures",
  "l-droids": "Droid models",
  "l-events": "Events",
  "l-locations": "Locations",
  "l-organizations": "Organizations and titles",
  "l-species": "Sentient species",
  "l-vehicles": "Vehicles and vessels",
  "l-technology": "Weapons and technology",
  "l-miscellanea": "Miscellanea",
  "c-dramatis personae": "Dramatis personae",
  "c-other characters": "Other characters",
  "c-characters": "Characters",
  "c-creatures": "Creatures",
  "c-droids": "Droid models",
  "c-events": "Events",
  "c-locations": "Locations",
  "c-organizations": "Organizations and titles",
  "c-species": "Sentient species",
  "c-vehicles": "Vehicles and vessels",
  "c-technology": "Weapons and technology",
  "c-miscellanea": "Miscellanea",
};
export const appearancesCategories = [
  "characters",
  "creatures",
  "droids",
  "events",
  "locations",
  "organizations",
  "species",
  "vehicles",
  "technology",
  "miscellanea",
];
export const appearancesTemplateNames = {
  Co: "cover only",
  Flash: "in flashback",
  Hologram: "in hologram",
  Mo: "mentioned only",
  Imo: "indirect mention only",
  "1st": "first appearance",
  "1stm": "first mentioned",
  "1stID": "first identified as: ",
  C: "",
};
export const appearancesIcons = {
  characters: mdiAccount,
  creatures: mdiCat,
  droids: mdiRobot,
  events: mdiCalendar,
  locations: mdiMapMarker,
  organizations: mdiMedal,
  species: mdiFamilyTree,
  vehicles: mdiSpaceStation,
  technology: mdiChip, //mdiSwordCross,
  miscellanea: mdiShape,
};

export const watchedName = "Watched";
export const watchlistName = "Watchlist";
export const builtinLists = [watchedName, watchlistName];

// Blur focus from the element if event is a mouse event (e.g. to hide focus ring)
export function blurIfMouse(event) {
  if (event.nativeEvent.clientX !== 0 && event.nativeEvent.clientY !== 0) {
    event.target.blur();
  }
}

export const imgAddress = (filename, size = Size.SMALL) => {
  if (!filename) return null;
  if (/^https?:\/\//.test(filename)) return filename;
  return `${IMAGE_PATH}${size}${encodeURIComponent(filename)}`;
};

export const buildTvImagePath = (seriesTitle) =>
  TV_IMAGE_PATH + seriesTitle.replaceAll(" ", "_") + ".webp";

export const escapeRegex = (str) => {
  return str.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
};

export const replaceInsensitive = (str, strReplace, strWith) => {
  // See http://stackoverflow.com/a/3561711/556609
  let esc = escapeRegex(strReplace);
  let reg = new RegExp(esc, "ig");
  return str.replace(reg, strWith);
};

// Returns result of predicate with value as argument.
// If value is an array call it for every array item, until true is returned.
export const testArrayOrValue = (value, predicate) => {
  return Array.isArray(value) ? value.some((v) => predicate(v)) : predicate(value);
};

// If wt is null or undef returns null or undef. Otherwise returns string.
export const wt2str = (wt) => {
  if (wt == null) return wt;
  if (typeof wt === "string") return wt;
  else if (!Array.isArray(wt)) {
    console.error("field is non string and non array: ", wt);
    return "";
  }

  let str = "";

  for (let item of wt) {
    switch (item.type) {
      case "text":
      case "note":
        str += item.text;
        break;
      case "list":
        console.log(item.data);
        str += item.data.map((el) => wt2str(el)).join("");
        break;
      case "internal link":
        str += item.text ?? item.page;
        break;
      case "external link":
        str += item.text ?? item.site;
        break;
      case "interwiki link":
        str += item.text ?? item.page;
        break;
    }
  }
  return str;
};
