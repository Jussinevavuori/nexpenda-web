import { ComponentState } from "../../hooks/componentStates/ComponentState";
import { useBooleanQueryState } from "../../hooks/state/useBooleanQueryState";
import { useStoreState } from "../../store";
import { SubscribeProps } from "./Subscribe";

export function useSubscribeController(props: SubscribeProps) {
  const [isCanceled, setIsCanceled] = useBooleanQueryState(
    ComponentState.keys.SubscriptionCanceled,
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
