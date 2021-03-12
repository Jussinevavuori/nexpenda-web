import { useAuth } from "../../hooks/application/useAuth";
import { useStoreActions } from "../../store";
import { SettingsSubscriptionManagerProps } from "./SettingsSubscriptionManager";

export function useSettingsSubscriptionManagerController(
  props: SettingsSubscriptionManagerProps
) {
  const createBillingPortalSession = useStoreActions(
    (_) => _.stripe.createBillingPortalSession
  );

  const user = useAuth();

  async function handleManageBilling() {
    const result = await createBillingPortalSession();
    if (result.isFailure()) {
      console.error(result);
    }
  }

  return {
    user,
    subscriptions: user?.subscriptions ?? [],
    handleManageBilling,
  };
}
