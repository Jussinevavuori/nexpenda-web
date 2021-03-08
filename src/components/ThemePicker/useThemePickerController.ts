import { useTheme } from "../../hooks/application/useTheme";
import { StorageService } from "../../services/StorageService";
import { useStoreActions } from "../../store";
import { ThemeUtils } from "../../utils/ThemeUtils/ThemeUtils";
import { ThemePickerProps } from "./ThemePicker";

export function useThemePickerController(props: ThemePickerProps) {
  const [theme, setTheme] = useTheme();

  const updateProfile = useStoreActions((_) => _.auth.updateProfile);

  function getThemeChangeHandler(targetTheme: Theme) {
    return () => {
      setTheme(targetTheme);
      updateProfile({ prefersColorScheme: targetTheme });
      StorageService.latestSelectedTheme.setValue(targetTheme);
    };
  }

  return {
    theme,
    getThemeChangeHandler,
    getThemeColor(theme: Theme) {
      return ThemeUtils.getThemePropertyValue(theme, "color-500");
    },
    allThemes: ThemeUtils.themes,
  };
}
