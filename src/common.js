// export const API = "http://localhost:5000/api/";
export const API = "/api/";
export const IMAGE_PATH = "images/";
export const TV_IMAGE_PATH = `${IMAGE_PATH}tv-images/thumb/`;
export const Audience = Object.freeze({
  a: "Adult",
  ya: "Young Adult",
  jr: "Junior",
});

export const Size = Object.freeze({
  THUMB: "thumb/",
  MEDIUM: "medium/",
  SMALL: "small/",
  FULL: "",
});

export const imgAddress = (filename, size = Size.SMALL) => {
  // TODO add a "no cover" image
  if (!filename) return null;
  if (/^https?:\/\//.test(filename)) return filename;
  return `${IMAGE_PATH}${size}${encodeURIComponent(filename)}`;
  // return `https://starwars.fandom.com/wiki/Special:FilePath/${filename}`;
  // let hash = md5(filename);
  // return `https://static.wikia.nocookie.net/starwars/images/${
  //   hash[0]
  // }/${hash.slice(0, 2)}/${filename}/revision/latest/scale-to-width-down/3000`;
};

// For dates in format yyyy-mm-dd that lack a month or day, or have question marks in their place
// return the latest possible date e.g. 2022-??-?? => 2022-12-31
export const unscuffDate = (date) => {
  if (/^\d{4}[-?]*$/.test(date)) return `${date.slice(0, 4)}-12-31`;
  if (/^\d{4}-\d{2}[-?]*$/.test(date)) {
    let d = new Date(date.slice(0, 4), parseInt(date.slice(5, 7)), 0);
    return `${d.getFullYear()}-${(d.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${d.getDate().toString().padStart(2, "0")}`;
  }
  return date;
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
