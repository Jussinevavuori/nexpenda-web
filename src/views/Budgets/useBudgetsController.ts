import { useMemo } from "react";
import { Budget } from "../../lib/DataModels/Budget";
import { useBudgetCreatorOpenState } from "../../hooks/componentStates/useBudgetCreatorOpenState";
import { useStoreState } from "../../store";
import { BudgetsProps } from "./Budgets";

export function useBudgetsController(props: BudgetsProps) {
  const budgets = useStoreState((_) => _.budgets.items);

  const { handleOpen } = useBudgetCreatorOpenState();

  function onCreateNewBudget(variant: "expense" | "income") {
    handleOpen(variant);
  }

  const { expenseBudgets, incomeBudgets } = useMemo(() => {
    return Budget.separateBudgets(budgets);
  }, [budgets]);

  return {
    incomeBudgets,
    expenseBudgets,
    onCreateNewExpenseBudget() {
      return onCreateNewBudget("expense");
    },
    onCreateNewIncomeBudget() {
      return onCreateNewBudget("income");
    },
  };
}
