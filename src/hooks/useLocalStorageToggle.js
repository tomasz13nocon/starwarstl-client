import { useReducer } from "react";

export default function useLocalStorageToggle(key, defaultValue) {
  return useReducer(
    (s, value) => {
      localStorage.setItem(key, value ?? !s);
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
