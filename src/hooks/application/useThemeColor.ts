import { useStoreActions, useStoreState } from "../../store";

export function useThemeColor(): [ThemeColor, (theme: ThemeColor) => void] {
  const themeColor = useStoreState((_) => _.theme.themeColor);
  const setThemeColor = useStoreActions((_) => _.theme.setThemeColor);

  return [themeColor, setThemeColor];
}
