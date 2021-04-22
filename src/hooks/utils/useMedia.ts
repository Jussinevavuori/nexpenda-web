import { useEffect, useState, useCallback, useMemo } from "react";

export function useMedia(query: string) {
  /**
   * Media query list from query
   */
  const mediaQueryList = useMemo(() => {
    return window.matchMedia(query);
  }, [query]);

  /**
   * Current value
   */
  const [value, setValue] = useState<boolean>(false);

  /**
   * Changehandler: sets the current value
   */
  const changeHandler = useCallback(() => {
    setValue(mediaQueryList.matches);
  }, [mediaQueryList]);

  /**
   * Listening to changes and cleanup
   */
  useEffect(() => {
    changeHandler();
    mediaQueryList.addEventListener("change", changeHandler);
    return () => {
      mediaQueryList.removeEventListener("change", changeHandler);
    };
  }, [mediaQueryList, changeHandler]);

  /**
   * Returning value
   */
  return value;
}

/**
 * (min-width: $px) media query hook wrapper
 */
export function useMinWidthMedia(minWidth: number) {
  const query = `(min-width: ${minWidth}px)`;
  return useMedia(query);
}

/**
 * (max-width: $px) media query hook wrapper
 */
export function useMaxWidthMedia(maxWidth: number) {
  const query = `(max-width: ${maxWidth}px)`;
  return useMedia(query);
}

/**
 * Responsive media queries for app breakpoints
 *
 * SM breakpoint at 600px
 */
export function useSmMedia() {
  const query = `(min-width: 600px)`;
  return useMedia(query);
}

/**
 * Responsive media queries for app breakpoints
 *
 * MD breakpoint at 900px
 */
export function useMdMedia() {
  const query = `(min-width: 900px)`;
  return useMedia(query);
}

/**
 * Responsive media queries for app breakpoints
 *
 * LG breakpoint at 1200px
 */
export function useLgMedia() {
  const query = `(min-width: 1200px)`;
  return useMedia(query);
}

/**
 * Responsive media queries for app breakpoints
 *
 * XL breakpoint at 1400px
 */
export function useXlMedia() {
  const query = `(min-width: 1400px)`;
  return useMedia(query);
}
