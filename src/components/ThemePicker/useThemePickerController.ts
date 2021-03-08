import { useTheme } from "../../hooks/application/useTheme";
import { ThemeUtils } from "../../utils/ThemeUtils/ThemeUtils";
import { ThemePickerProps } from "./ThemePicker";

export function useThemePickerController(props: ThemePickerProps) {
  const [theme, setTheme] = useTheme();

  return {
    theme,
    getThemeChangeHandler(theme: Theme) {
      return () => setTheme(theme);
    },
    getThemeColor(theme: Theme) {
      return ThemeUtils.getThemePropertyValue(theme, "color-500");
    },
    allThemes: ThemeUtils.themes,
  };
}
