import { useStoreState, useStoreActions } from "../../store";
import { useOpenStateWrapper } from "../state/useOpenStateWrapper";

export function useIsSearchOpen() {
  const isSearchOpen = useStoreState((_) => _.search.isOpen);
  const setSearchOpen = useStoreActions((_) => _.search.setOpen);

  return useOpenStateWrapper([isSearchOpen, setSearchOpen]);
}
