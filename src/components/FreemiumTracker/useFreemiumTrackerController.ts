import { useMemo } from "react";
import { useStoreState } from "../../store";
import { FreemiumTrackerProps } from "./FreemiumTracker";

export function useFreemiumTrackerController(props: FreemiumTrackerProps) {
  // Premium status
  const isPremium = useStoreState((_) => _.auth.user)?.isPremium;

  // Limits
  const appConfig = useStoreState((_) => _.appConfig.value);
  const transactionsLimit = appConfig.freeTransactionsLimit;
  const budgetsLimit = appConfig.freeBudgetsLimit;

  // Counts
  const transactions = useStoreState((_) => _.transactions.items);
  const budgets = useStoreState((_) => _.budgets.items);
  const transactionsCount = useMemo(() => transactions.length, [transactions]);
  const budgetsCount = useMemo(() => budgets.length, [budgets]);

  // Left
  const transactionsLeft = transactionsLimit - transactionsCount;
  const budgetsLeft = budgetsLimit - budgetsCount;

  // Exceeded
  const transactionsLimitExceeded = transactionsCount >= transactionsLimit;
  const budgetsLimitExceeded = budgetsCount >= budgetsLimit;

  // Percentages
  const transactionsPercentage = (100 * transactionsCount) / transactionsLimit;
  const budgetsPercentage = (100 * budgetsCount) / budgetsLimit;

  return {
    isPremium,
    isDefaultAppConfig: appConfig.isDefaultAppConfig,

    transactionsLimit,
    transactionsCount,
    transactionsLeft,
    transactionsPercentage,
    transactionsLimitExceeded,

    budgetsLimit,
    budgetsCount,
    budgetsLeft,
    budgetsPercentage,
    budgetsLimitExceeded,
  };
}
