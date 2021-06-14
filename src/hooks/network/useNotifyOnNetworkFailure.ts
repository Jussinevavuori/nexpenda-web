import { useCallback } from "react";
import { Service } from "../../services/Service";
import { useStoreActions } from "../../store";
import { ListenerType } from "../../utils/SubscriptionUtils/Subscribable";
import { useRedirect } from "../utils/useRedirect";
import { useOnNetworkError } from "./useOnNetworkError";

type Args = Parameters<ListenerType<typeof Service.Failuresubscribable>>;

export function useNotifyOnNetworkFailure() {
  const notify = useStoreActions((_) => _.notification.notify);
  const redirect = useRedirect();

  const handler = useCallback(
    (...args: Args) => {
      const failure = args[0];
      switch (failure.code) {
        case "transaction/limit-exceeded": {
          notify({
            message:
              `You have hit the limit of free transactions. ` +
              `Upgrade to Nexpenda premium to continue creating ` +
              `more transactions.`,
            severity: "error",
            action: {
              buttonType: "button",
              label: "Upgrade",
              onClick() {
                redirect((_) => _.subscribe);
              },
            },
          });
          break;
        }

        case "budget/limit-exceeded": {
          notify({
            message:
              `You have hit the limit of free budgets. ` +
              `Upgrade to Nexpenda premium to continue creating ` +
              `more budgets.`,
            severity: "error",
            action: {
              buttonType: "button",
              label: "Upgrade",
              onClick() {
                redirect((_) => _.subscribe);
              },
            },
          });
          break;
        }
      }
    },
    [notify, redirect]
  );

  useOnNetworkError(handler);
}
