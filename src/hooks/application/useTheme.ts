import { useStoreActions, useStoreState } from "../../store";

export function useTheme(): [Theme, (theme: Theme) => void] {
  const theme = useStoreState((_) => _.config.theme);
  const setTheme = useStoreActions((_) => _.config.setTheme);

  return [theme, setTheme];
}
