export const API =
  // window.location.protocol +
  // "//" +
  // (import.meta.env.VITE_API_HOST ?? window.location.hostname) +
  (import.meta.env.VITE_API_HOST ?? "") + "/api/";
// export const API = "/api/";
export const IMAGE_PATH = (import.meta.env.VITE_IMG_HOST ?? "") + "/img/covers/";
// export const IMAGE_PATH = "/img/covers/";
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
// "dramatis personae"
// "other characters"
// "characters"
// "creatures"
// "droids"
// "events"
// "locations"
// "organizations"
// "species"
// "vehicles"
// "technology"
// "miscellanea"
// "l-dramatis personae"
// "l-other characters"
// "l-characters"
// "l-creatures"
// "l-droids"
// "l-events"
// "l-locations"
// "l-organizations"
// "l-species"
// "l-vehicles"
// "l-technology"
// "l-miscellanea"
// "c-dramatis personae"
// "c-other characters"
// "c-characters"
// "c-creatures"
// "c-droids"
// "c-events"
// "c-locations"
// "c-organizations"
// "c-species"
// "c-vehicles"
// "c-technology"
// "c-miscellanea"

export const appearancesCategories = {
  "dramatis personae": "Dramatis personae",
  "other characters": "Other characters",
  characters: "Characters",
  creatures: "Creatures",
  droids: "Droids",
  events: "Events",
  locations: "Locations",
  organizations: "Organizations",
  species: "Species",
  vehicles: "Vehicles",
  technology: "Technology",
  miscellanea: "Miscellanea",
  "l-dramatis personae": "Dramatis personae (legends)",
  "l-other characters": "Other characters (legends)",
  "l-characters": "Characters (legends)",
  "l-creatures": "Creatures (legends)",
  "l-droids": "Droids (legends)",
  "l-events": "Events (legends)",
  "l-locations": "Locations (legends)",
  "l-organizations": "Organizations (legends)",
  "l-species": "Species (legends)",
  "l-vehicles": "Vehicles (legends)",
  "l-technology": "Technology (legends)",
  "l-miscellanea": "Miscellanea (legends)",
  "c-dramatis personae": "Dramatis personae (canon)",
  "c-other characters": "Other characters (canon)",
  "c-characters": "Characters (canon)",
  "c-creatures": "Creatures (canon)",
  "c-droids": "Droids (canon)",
  "c-events": "Events (canon)",
  "c-locations": "Locations (canon)",
  "c-organizations": "Organizations (canon)",
  "c-species": "Species (canon)",
  "c-vehicles": "Vehicles (canon)",
  "c-technology": "Technology (canon)",
  "c-miscellanea": "Miscellanea (canon)",
};
export const appearancesTemplateNames = {
  Co: "Cover only",
  Flash: "In flashback",
  Mo: "Mentioned only",
  Imo: "Indirect mention only",
  "1st": "First appearance",
  "1stm": "First mentioned",
  "1stID": "First identified as ",
};

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
  // return `https://starwars.fandom.com/wiki/Special:FilePath/${filename}`;
  // let hash = md5(filename);
  // return `https://static.wikia.nocookie.net/starwars/images/${
  //   hash[0]
  // }/${hash.slice(0, 2)}/${filename}/revision/latest/scale-to-width-down/3000`;
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
