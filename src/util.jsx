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

export const replaceInsensitive = function (str, strReplace, strWith) {
  // See http://stackoverflow.com/a/3561711/556609
  let esc = escapeRegex(strReplace);
  let reg = new RegExp(esc, "ig");
  return str.replace(reg, strWith);
};
