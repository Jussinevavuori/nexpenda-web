import { endOfMonth, startOfMonth } from "date-fns";
import { useEffect } from "react";
import { useStoreActions, useStoreState } from "../../store";

export function useInitializeData() {
  const user = useStoreState((_) => _.auth.user);

  const getAppConfig = useStoreActions((_) => _.appConfig.fetchConfig);
  const getProfile = useStoreActions((_) => _.auth.getProfile);
  const getBudgets = useStoreActions((_) => _.budgets.getBudgets);
  const getSchedules = useStoreActions((_) => _.schedules.getSchedules);
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
    if (!user) return;

    getTransactions({
      before: endOfMonth(new Date()),
      after: startOfMonth(new Date()),
    }).then(() => {
      getTransactions();
    });
  }, [user, getTransactions]);

  /**
   * Fetch the budgets
   */
  useEffect(() => {
    if (!user) return;

    getBudgets();
  }, [user, getBudgets]);

  /**
   * Fetch the schedules
   */
  useEffect(() => {
    if (!user) return;

    getSchedules();
  }, [user, getSchedules]);
}
