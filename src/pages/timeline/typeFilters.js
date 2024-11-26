import { produce } from "immer";
import _ from "lodash";

const createTypeFilters = (obj) => {
  if (!obj) throw new Error("Incorrect template structure!");
  const ret = {};
  for (const [key, value] of Object.entries(obj)) {
    ret[key] =
      typeof value === "boolean"
        ? value
        : value.value !== undefined
          ? value.value
          : createTypeFilters(value.children || value);
    // value.value - object representing a single filter
    // value.children - standard structure
    // value - object with direct children
  }
  return ret;
};

//        *Note to future self: stop overengineering shit*
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
export const typeFiltersInitializer = (template) => {
  try {
    return JSON.parse(localStorage.getItem("typeFilters")) ?? createTypeFilters(template);
  } catch (e) {
    throw e instanceof RangeError ? "Incorrect template structure! (infinite recursion)" : e;
  }
};

const setChildren = (children, to) => {
  for (const [key, value] of Object.entries(children)) {
    if (typeof value === "boolean") {
      children[key] = to;
    } else {
      setChildren(value, to);
    }
  }
};

export const typeFiltersReducer = produce((draft, { path, to }) => {
  const atPath = _.get(draft, path);
  typeof atPath === "boolean" ? _.set(draft, path, to) : setChildren(atPath, to);
});
