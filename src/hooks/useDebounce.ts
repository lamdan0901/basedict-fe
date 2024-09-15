import { useRef, useCallback, useState, useEffect } from "react";

export const useDebounce = <T>(value: T, delay = 300) => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

export function useDebounceFn<T extends (...args: any[]) => any>(
  callback: T,
  delay = 300
): (...args: Parameters<T>) => void {
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const callbackRef = useRef<T>(callback);

  // Update the callback ref whenever the callback changes
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  const debouncedFunction = useCallback(
    (...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        callbackRef.current(...args);
      }, delay);
    },
    [delay]
  );

  // Clear timeout if the component is unmounted or delay changes
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return debouncedFunction;
}
