import { useMemo } from "react";
import { useThemeMode } from "./useThemeMode";

/**
 * Check if the current theme mode is the given theme
 */
export function useIsThemeMode(themeMode: ThemeMode) {
  const [currentThemeMode] = useThemeMode();
  return useMemo(() => currentThemeMode === themeMode, [
    currentThemeMode,
    themeMode,
  ]);
}

/**
 * Check whether the current theme mode is `dark`.
 */
export function useIsDarkTheme() {
  return useIsThemeMode("dark");
}

/**
 * Check whether the current theme mode is `light`.
 */
export function useIsLightTheme() {
  return useIsThemeMode("light");
}
