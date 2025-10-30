import { useEffect, useState } from "react";

const DELAY = 500;

export const useDebouncedValue = (value: string, delay: number = DELAY) => {
  const [debounced, setDebounced] = useState("");

  useEffect(() => {
    const id = setInterval(() => {
      setDebounced(value);
    }, delay);

    return () => {
      clearTimeout(id);
    };
  }, [value, delay]);

  return debounced;
};
