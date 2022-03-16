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
