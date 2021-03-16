import { useStoreActions } from "../../store";
import { useBudgetEditorDrawerVariableOpenState } from "../BudgetEditorDrawer/useBudgetEditorDrawerController";
import { BudgetBlockMenuProps } from "./BudgetBlockMenu";

export function useBudgetBlockMenuController(props: BudgetBlockMenuProps) {
  // Editing
  const { 1: setIsEditingId } = useBudgetEditorDrawerVariableOpenState();
  function handleEdit() {
    setIsEditingId(props.budget.id);
  }

  // Deleting
  const deleteBudget = useStoreActions((_) => _.budgets.deleteBudget);
  function handleDelete() {
    deleteBudget(props.budget.id);
  }

  return {
    handleEdit,
    handleDelete,
  };
}
