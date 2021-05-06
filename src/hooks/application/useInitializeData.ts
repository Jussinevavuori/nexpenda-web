import { endOfMonth, startOfMonth } from "date-fns";
import { useEffect } from "react";
import { useStoreActions } from "../../store";

export function useInitializeData() {
  const getAppConfig = useStoreActions((_) => _.appConfig.fetchConfig);
  const getProfile = useStoreActions((_) => _.auth.getProfile);
  const getTransactions = useStoreActions(
    (_) => _.transactions.getTransactions
  );

  /**
   * Fetch the user's profile.
   */
  useEffect(() => {
    getProfile();
  }, [getProfile]);

  /**
   * Fetch the app config.
   */
  useEffect(() => {
    getAppConfig();
  }, [getAppConfig]);

  /**
   * First fetch the transactions only for this month. Then fetch
   * all transactions.
   */
  useEffect(() => {
    getTransactions({
      before: endOfMonth(new Date()),
      after: startOfMonth(new Date()),
    }).then(() => {
      getTransactions();
    });
  }, [getTransactions]);
}
