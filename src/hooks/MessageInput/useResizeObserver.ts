import { useEffect, useRef, useCallback } from "react";

const useResizeObserver = (onResize: () => void) => {
  const observerRef = useRef<HTMLFormElement>(null);

  const debouncedOnResize = useCallback(() => {
    let timeout: NodeJS.Timeout;
    return () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => onResize(), 100);
    };
  }, [onResize]);

  useEffect(() => {
    const observer = new ResizeObserver(debouncedOnResize());
    const currentRef = observerRef.current;

    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [debouncedOnResize]);

  return observerRef;
};

export default useResizeObserver;
