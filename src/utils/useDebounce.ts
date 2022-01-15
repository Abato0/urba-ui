import { useEffect, useState } from "react";

const useDebounce = (search: String, time: number) => {
  const [debouncedValue, setDebouncedValue] = useState(search);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(search);
    }, time);

    return () => {
      clearTimeout(handler);
    };
  }, [search, time]);

  return debouncedValue;
};

export default useDebounce;
