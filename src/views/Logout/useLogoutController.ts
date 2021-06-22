import { useEffect } from "react";
import { LoggedOutEvent } from "../../history/LoggedOutEvent";
import { useRedirect } from "../../hooks/utils/useRedirect";
import { routes } from "../../Routes";
import { StorageService } from "../../services/StorageService";
import { useStoreActions } from "../../store";
import { ThemeUtils } from "../../lib/Theme/ThemeUtils";
import { LogoutProps } from "./Logout";
import { ThemeColors } from "../../lib/Theme/ThemeColors";

export function useLogoutController(props: LogoutProps) {
  const pushEvent = useStoreActions((_) => _.history.pushEvent);
  const redirect = useRedirect();

  /**
   * If the user had an access token (this means they had logged in but
   * were logged out), we notify the user with a LoggedOutEvent.
   */
  useEffect(() => {
    const hadAccessToken = StorageService.hadAccessToken;
    if (hadAccessToken.getValue()) {
      pushEvent(new LoggedOutEvent());
      hadAccessToken.clearValue();
    }
    redirect(routes.login);
  }, [pushEvent, redirect]);

  function handleRedirect() {
    redirect(routes.login);
  }

  /**
   * Handle theme reset
   */
  const setThemeColor = useStoreActions((_) => _.theme.setThemeColor);
  useEffect(() => {
    ThemeUtils.resetTheme();
    setThemeColor(ThemeColors.freeDefaultThemeColor);
  }, [setThemeColor]);

  return { handleRedirect };
}
