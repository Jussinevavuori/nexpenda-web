import { useStoreActions, useStoreState } from "../../store";

export function useThemeMode(): [ThemeMode, (theme: ThemeMode) => void] {
  const themeMode = useStoreState((_) => _.theme.themeMode);
  const setThemeMode = useStoreActions((_) => _.theme.setThemeMode);

  return [themeMode, setThemeMode];
}
