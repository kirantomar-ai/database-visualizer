import { useCallback } from "react";

const useLocalStorage = (key) => {
  const setData = useCallback(
    (data) => {
      if (!key) return;
      localStorage.setItem(key, JSON.stringify(data));
    },
    [key]
  );

  const getData = useCallback(() => {
    if (!key) return null;
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  }, [key]);

  return { getData, setData };
};

export default useLocalStorage;
