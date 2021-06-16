import { useMemo } from "react";
import { useFreemiumTrackerOpenState } from "../../hooks/componentStates/useFreemiumTrackerOpenState";
import { useStoreState } from "../../store";
import { MiniFreemiumTrackerProps } from "./MiniFreemiumTracker";

export function useMiniFreemiumTrackerController(
  props: MiniFreemiumTrackerProps
) {
  // Premium status
  const isUserLoaded = useStoreState((_) => _.auth.initialized);
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

  const { handleOpen } = useFreemiumTrackerOpenState();

  return {
    isUserLoaded,
    isPremium,
    isDefaultAppConfig: appConfig.isDefaultAppConfig,
    limit: props.variant === "transaction" ? transactionsLimit : budgetsLimit,
    count: props.variant === "transaction" ? transactionsCount : budgetsCount,
    left: props.variant === "transaction" ? transactionsLeft : budgetsLeft,
    percentage:
      props.variant === "transaction"
        ? transactionsPercentage
        : budgetsPercentage,
    limitExceeded:
      props.variant === "transaction"
        ? transactionsLimitExceeded
        : budgetsLimitExceeded,
    handleOpen,
  };
}
