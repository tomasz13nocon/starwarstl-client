export default function (str, data, timelineRangeBy) {
  if (str) {
    // TODO: optimize: debounce or title index/array
    let strU = str.toUpperCase();
    for (let item of data) {
      if (strU === item.title.toUpperCase()) {
        let ret = { isTitle: true };
        if (timelineRangeBy === "date") {
          if (!item.dateParsed) return undefined; // TODO display msg: Can't use this media, since its placement is a mystery
          ret.value = item.chronology;
          ret.dates = item.dateParsed;
        } else {
          ret.value = new Date(item.releaseDateEffective ?? item.releaseDate);
        }
        return ret;
      }
    }
  }

  if (timelineRangeBy === "date") {
    let dateMatch = str.toLowerCase().match(/^\s*(\d+)\s*([ab])by\s*$/);
    if (dateMatch !== null) {
      let date = +dateMatch[1];
      if (dateMatch[2] === "b") {
        date = -date;
      }
      return { value: date };
    }
    dateMatch = str.match(/^\s*([-])?(\d+)\s*$/);
    if (dateMatch !== null) {
      let date = +dateMatch[2];
      if (dateMatch[1] !== undefined) {
        date = -date;
      }
      return { value: date };
    }
  } else if (timelineRangeBy === "releaseDate") {
    let date = new Date(str);
    if (!isNaN(date)) {
      return { value: date };
    }
  }
}
