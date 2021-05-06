import { useMemo } from "react";
import { useStoreState } from "../../store";
import { useIsPremium } from "./useIsPremium";

/**
 * Check if the current user has hit the maximum amount of allowed
 * budgets.
 */
export function useIsBudgetsLimitExceeded() {
  const budgets = useStoreState((_) => _.budgets.items);
  const count = useMemo(() => budgets.length, [budgets]);

  const config = useStoreState((_) => _.appConfig.value);
  const limit = useMemo(() => config.freeBudgetsLimit, [config]);

  const isPremium = useIsPremium();

  return useMemo(() => {
    return isPremium || count >= limit;
  }, [isPremium, count, limit]);
}
