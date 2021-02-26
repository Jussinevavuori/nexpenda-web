import ReactGA from "react-ga";
import { useEffect } from "react";
import { useStoreState } from "../../store";
import { useLocation } from "react-router-dom";

export function useGtagTracking() {
  // Set user
  const user = useStoreState((_) => _.auth.user);
  useEffect(() => {
    console.log(`[SET UID]: ${user?.id}`);
    ReactGA.set({ userId: user?.id });
  }, [user]);

  // Pageviews
  const location = useLocation();
  useEffect(() => {
    console.log(`[PAGEVIEW]: ${location.pathname}`);
    ReactGA.pageview(location.pathname);
  }, [location.pathname]);
}
