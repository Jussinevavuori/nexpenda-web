import { MoneyAmount } from "../../classes/MoneyAmount";
import { useBudgetsContext } from "../../contexts/BudgetsContext.context";
import { useStoreState } from "../../store";
import { BudgetBlockProps } from "./BudgetBlock";

export function useBudgetBlockController(props: BudgetBlockProps) {
  const categories = useStoreState((_) => _.transactions.categories);
  const context = useBudgetsContext();

  const progress = context.extendedBudgets.find(
    (_) => _.budget.id === props.budget.id
  );

  const budgetCategories = props.budget.getCategories(categories);
  const budgetLabel = props.budget.getLabel(categories);

  return {
    budgetCategories,
    budgetLabel,
    budgetNotFound: !progress,
    progress: progress?.progressAmount ?? new MoneyAmount(0),
    percentage: progress?.progressPercentage ?? 0,
  };
}
