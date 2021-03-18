import { endOfMonth, startOfMonth } from "date-fns";
import { useEffect } from "react";
import { useStoreActions } from "../../store";

export function useInitializeData() {
  /**
   * Initialize by fetching the user's profile and this month's transactions
   * if any
   */
  const getProfile = useStoreActions((_) => _.auth.getProfile);
  const getTransactions = useStoreActions(
    (_) => _.transactions.getTransactions
  );
  useEffect(() => {
    getProfile();
    getTransactions({
      before: endOfMonth(new Date()),
      after: startOfMonth(new Date()),
    });
  }, [getProfile, getTransactions]);
}
