import { useRef, useEffect } from "react";
import useIsomorphicLayoutEffect from "./useIsomorphicLayoutEffect";

const useInterval = (callback: () => void, delay: number | null) => {
  const savedCallback = useRef(callback);

  useIsomorphicLayoutEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (!delay && delay !== 0) return;
    const id = setInterval(() => savedCallback.current(), delay);

    return () => clearInterval(id);
  }, [delay]);
};

export default useInterval;
