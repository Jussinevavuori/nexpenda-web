import { StorageService } from "../../services/StorageService";
import { useStoreState } from "../../store";
import { AutoLoginIndicatorProps } from "./AutoLoginIndicator";

export function useAutoLoginIndicatorController(
  props: AutoLoginIndicatorProps
) {
  const authInitialized = useStoreState((_) => _.auth.initialized);
  const wasLoggedIn = StorageService.wasLoggedIn.getValue();

  /**
   * Show auto-login when user is known to have previously logged in and the
   * auth has not yet been initialized.
   */
  const showAutoLogin = !authInitialized && wasLoggedIn;

  return { showAutoLogin };
}
