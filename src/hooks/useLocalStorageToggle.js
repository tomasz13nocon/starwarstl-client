import { useReducer } from "react";

export default function useLocalStorageToggle(key, defaultValue) {
  return useReducer(
    (s) => {
      localStorage.setItem(key, !s);
      return !s;
    },
    defaultValue,
    (d) => {
      let ls = localStorage.getItem(key);
      if (ls === null) return d;
      return ls === "true";
    }
  );
}
