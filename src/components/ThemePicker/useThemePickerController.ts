import { useThemeColor } from "../../hooks/application/useThemeColor";
import { useThemeMode } from "../../hooks/application/useThemeMode";
import { StorageService } from "../../services/StorageService";
import { useStoreActions } from "../../store";
import { ThemeUtils } from "../../utils/ThemeUtils/ThemeUtils";
import { ThemePickerProps } from "./ThemePicker";

export function useThemePickerController(props: ThemePickerProps) {
  const [themeColor, setThemeColor] = useThemeColor();
  const [themeMode, setThemeMode] = useThemeMode();

  const updateProfile = useStoreActions((_) => _.auth.updateProfile);

  function getThemeColorChangeHandler(target: ThemeColor) {
    return () => {
      setThemeColor(target);
      updateProfile({ themeColor: target });
      StorageService.latestSelectedThemeColor.setValue(target);
    };
  }

  function getThemeModeChangeHandler(target: ThemeMode) {
    return () => {
      setThemeMode(target);
      updateProfile({ themeMode: target });
      StorageService.latestSelectedThemeMode.setValue(target);
    };
  }

  return {
    themeColor,
    themeMode,
    getThemeColorChangeHandler,
    getThemeModeChangeHandler,
    getThemeColor(theme: ThemeColor) {
      return ThemeUtils.getThemePropertyValue(theme, "color-500");
    },
    allThemeColors: ThemeUtils.themeColors,
    allThemeModes: ThemeUtils.themeModes,
  };
}
