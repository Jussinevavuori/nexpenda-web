import { useMemo } from "react";
import { Budget } from "../../classes/Budget";
import { useBudgetCreatorDrawerVariableOpenState } from "../../components/BudgetCreatorDrawer/useBudgetCreatorDrawerController";
import { useStoreState } from "../../store";
import { BudgetsProps } from "./Budgets";

export function useBudgetsController(props: BudgetsProps) {
  const budgets = useStoreState((_) => _.budgets.items);

  const { 1: openBudgetCreator } = useBudgetCreatorDrawerVariableOpenState();

  function onCreateNewBudget(variant: "expense" | "income") {
    openBudgetCreator(variant);
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
