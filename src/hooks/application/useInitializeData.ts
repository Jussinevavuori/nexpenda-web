import { endOfMonth, startOfMonth } from "date-fns";
import { useEffect } from "react";
import { useStoreActions } from "../../store";

export function useInitializeData() {
  const getProfile = useStoreActions((_) => _.auth.getProfile);
  const getTransactions = useStoreActions(
    (_) => _.transactions.getTransactions
  );

  /**
   * Initialize by fetching the user's profile and this month's transactions
   * if any exist.
   *
   * @todo Remove timeout
   */
  useEffect(
    function initializeAuth() {
      setTimeout(getProfile, 2000);
      // getProfile();
    },
    [getProfile]
  );

  useEffect(
    function initializeTransactions() {
      getTransactions({
        before: endOfMonth(new Date()),
        after: startOfMonth(new Date()),
      });
    },
    [getTransactions]
  );
}
