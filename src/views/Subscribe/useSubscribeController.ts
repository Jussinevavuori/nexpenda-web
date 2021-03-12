import { useBooleanQueryState } from "../../hooks/state/useBooleanQueryState";
import { SubscribeProps } from "./Subscribe";

export function useSubscribeController(props: SubscribeProps) {
  const [isCanceled, setIsCanceled] = useBooleanQueryState(
    "canceled",
    "replace",
    "true"
  );

  return {
    isCanceled,
    handleClearCanceled() {
      setIsCanceled(false);
    },
  };
}
