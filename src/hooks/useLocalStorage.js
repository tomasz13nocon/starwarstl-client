import { useCallback, useState } from "react";

export function useLocalStorage(key, initialValue, migration) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        let itemParsed = JSON.parse(item);
        return migration ? migration(itemParsed) : itemParsed;
      } else return initialValue;
    } catch (error) {
      console.log(error);
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value) => {
      // const valueToStore = value instanceof Function ? value(storedValue) : value;
      // setStoredValue(valueToStore);
      // window.localStorage.setItem(key, JSON.stringify(valueToStore));

      setStoredValue((prev) => {
        const next = value instanceof Function ? value(prev) : value;
        try {
          window.localStorage.setItem(key, JSON.stringify(next));
        } catch (e) {
          console.error(e);
        }
        return next;
      });
    },
    [key],
  );

  return [storedValue, setValue];
}
