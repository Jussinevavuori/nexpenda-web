import { useRedirect } from "../../hooks/utils/useRedirect";
import { SubscribeSuccessProps } from "./SubscribeSuccess";

export function useSubscribeSuccessController(props: SubscribeSuccessProps) {
  const redirect = useRedirect();

  return {
    onContinueToApp() {
      redirect((_) => _.dashboard);
    },
  };
}
