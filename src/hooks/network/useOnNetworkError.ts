import { useEffect } from "react";
import { Service } from "../../services/Service";
import { ListenerType } from "../../utils/SubscriptionUtils/Subscribable";

export function useOnNetworkError(
  handler: ListenerType<typeof Service.Failuresubscribable>
) {
  useEffect(() => Service.Failuresubscribable.subscribe(handler), [handler]);
}
