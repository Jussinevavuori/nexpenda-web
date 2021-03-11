import { useAuth } from "../../hooks/application/useAuth";
import { useRedirect } from "../../hooks/utils/useRedirect";
import { SubscriptionFrameProps } from "./SubscriptionFrame";

export function useSubscriptionFrameController(props: SubscriptionFrameProps) {
  const redirect = useRedirect();
  const user = useAuth();

  return {
    user,
    onBack() {
      redirect((_) => _.dashboard);
    },
  };
}
