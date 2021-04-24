import { useMemo } from "react";
import { Budget } from "../../classes/Budget";
import { useBudgetCreatorDialogVariableOpenState } from "../../components/BudgetCreatorDialog/useBudgetCreatorDialogController";
import { useStoreState } from "../../store";
import { BudgetsProps } from "./Budgets";

export function useBudgetsController(props: BudgetsProps) {
  const budgets = useStoreState((_) => _.budgets.items);

  const { 1: openBudgetCreator } = useBudgetCreatorDialogVariableOpenState();

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
