import { useStoreState } from "../../store";

export function useIsPremium() {
  return Boolean(useStoreState((_) => _.auth.user)?.isPremium);
}
