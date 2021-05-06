import { useMemo } from "react";
import { useStoreState } from "../../store";
import { useIsPremium } from "./useIsPremium";

/**
 * Check if the current user has hit the maximum amount of allowed
 * transactions.
 */
export function useIsTransactionsLimitExceeded() {
  const transactions = useStoreState((_) => _.transactions.items);
  const count = useMemo(() => transactions.length, [transactions]);

  const config = useStoreState((_) => _.appConfig.value);
  const limit = useMemo(() => config.freeTransactionsLimit, [config]);

  const isPremium = useIsPremium();

  return useMemo(() => {
    return isPremium || count >= limit;
  }, [isPremium, count, limit]);
}
