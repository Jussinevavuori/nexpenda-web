import { useBooleanQueryState } from "../../hooks/state/useBooleanQueryState";
import { useStoreState } from "../../store";
import { SubscribeProps } from "./Subscribe";

export function useSubscribeController(props: SubscribeProps) {
  const [isCanceled, setIsCanceled] = useBooleanQueryState(
    "canceled",
    "replace",
    "true"
  );

  const isPremium = useStoreState((_) => _.auth.user)?.isPremium;

  return {
    isCanceled,
    isPremium,
    handleClearCanceled() {
      setIsCanceled(false);
    },
  };
}
