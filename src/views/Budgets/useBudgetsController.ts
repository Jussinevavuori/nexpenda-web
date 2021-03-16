import { useMemo } from "react";
import { Budget } from "../../classes/Budget";
import { useStoreState } from "../../store";
import { BudgetsProps } from "./Budgets";

export function useBudgetsController(props: BudgetsProps) {
  const budgets = useStoreState((_) => _.budgets.items);

  const { expenseBudgets, incomeBudgets } = useMemo(() => {
    return Budget.separateBudgets(budgets);
  }, [budgets]);

  return {
    incomeBudgets,
    expenseBudgets,
  };
}
