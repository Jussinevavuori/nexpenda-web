import { useState } from "react";
import { useStoreState } from "../../store";
import { SubscribeProps } from "./Subscribe";

export function useSubscribeController(props: SubscribeProps) {
  const [isCanceled, setIsCanceled] = useState(!!props.cancelled);

  const isPremium = useStoreState((_) => _.auth.user)?.isPremium;

  return {
    isCanceled,
    isPremium,
    handleClearCanceled() {
      setIsCanceled(false);
    },
  };
}
