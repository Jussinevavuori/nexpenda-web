import { useBudgetBlockMenuVariableOpenState } from "../../hooks/componentStates/useBudgetBlockMenuVariableOpenState";
import { useBudgetEditorDialogVariableOpenState } from "../../hooks/componentStates/useBudgetEditorDialogVariableOpenState";
import { useStoreActions } from "../../store";
import { BudgetBlockMenuProps } from "./BudgetBlockMenu";

export function useBudgetBlockMenuController(props: BudgetBlockMenuProps) {
  // Editing
  const { 1: setIsEditingId } = useBudgetEditorDialogVariableOpenState();
  const [menuId, setMenuId] = useBudgetBlockMenuVariableOpenState();
  const isOpen = menuId === props.budget.id;

  function handleClose() {
    setMenuId(null);
  }

  function handleEdit() {
    setIsEditingId(props.budget.id);
  }

  // Deleting
  const deleteBudget = useStoreActions((_) => _.budgets.deleteBudget);
  function handleDelete() {
    deleteBudget(props.budget.id);
    handleClose();
  }

  return {
    isOpen,
    handleEdit,
    handleDelete,
    handleClose,
  };
}
