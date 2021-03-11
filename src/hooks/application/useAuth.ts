import { useStoreState } from "../../store";

export function useAuth() {
  return useStoreState((_) => _.auth.user);
}
