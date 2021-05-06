import { useEffect } from "react";
import { Service } from "../../services/Service";
import { ListenerType } from "../../utils/SubscriptionUtils/Subscribable";

export function useOnNetworkError(
  handler: ListenerType<typeof Service.NetworkFailureSubscribable>
) {
  useEffect(() => Service.NetworkFailureSubscribable.subscribe(handler), [
    handler,
  ]);
}
