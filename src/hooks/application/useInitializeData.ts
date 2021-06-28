import { endOfMonth, startOfMonth } from "date-fns";
import { useEffect } from "react";
import { useStoreActions, useStoreState } from "../../store";

export function useInitializeData() {
  const user = useStoreState((_) => _.auth.user);
  const userId = user?.id;

  const getAppConfig = useStoreActions((_) => _.appConfig.fetchConfig);
  const getProfile = useStoreActions((_) => _.auth.getProfile);
  const getBudgets = useStoreActions((_) => _.budgets.getBudgets);
  const getSchedules = useStoreActions((_) => _.schedules.getSchedules);
  const getTransactions = useStoreActions(
    (_) => _.transactions.getTransactions
  );
  const getPremiumPrices = useStoreActions(
    (_) => _.premiumPrices.getPremiumPrices
  );
  const createScheduledTransactions = useStoreActions(
    (_) => _.schedules.createScheduledTransactions
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
   * Fetch the premium prices
   */
  useEffect(() => {
    getPremiumPrices();
  }, [getPremiumPrices]);

  /**
   * First fetch the transactions only for this month. Then fetch
   * all transactions.
   */
  useEffect(() => {
    if (!userId) return;
    getTransactions({
      before: endOfMonth(new Date()),
      after: startOfMonth(new Date()),
    }).then(() => {
      getTransactions();
    });
  }, [userId, getTransactions]);

  /**
   * Fetch the budgets
   */
  useEffect(() => {
    if (!userId) return;
    getBudgets();
  }, [userId, getBudgets]);

  /**
   * Fetch the schedules
   */
  useEffect(() => {
    if (!userId) return;
    getSchedules();
  }, [userId, getSchedules]);

  /**
   * Create scheduled transactions
   */
  useEffect(() => {
    if (!userId) return;
    createScheduledTransactions();
  }, [userId, createScheduledTransactions]);
}
