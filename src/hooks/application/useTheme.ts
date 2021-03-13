import { useStoreActions, useStoreState } from "../../store";

export function useTheme(): [Theme, (theme: Theme) => void] {
  const theme = useStoreState((_) => _.theme.theme);
  const setTheme = useStoreActions((_) => _.theme.setTheme);

  return [theme, setTheme];
}
