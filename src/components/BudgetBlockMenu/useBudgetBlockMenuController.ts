import { useQueryState } from "../../hooks/state/useQueryState";
import { useStoreActions } from "../../store";
import { useBudgetEditorDialogVariableOpenState } from "../BudgetEditorDialog/useBudgetEditorDialogController";
import { BudgetBlockMenuProps } from "./BudgetBlockMenu";

export const BudgetBlockMenuDialogOpenHash = "budget";

export function useBudgetBlockMenuDialogVariableOpenState() {
  return useQueryState<null | string>({
    key: BudgetBlockMenuDialogOpenHash,
    method: "push",
    decode(value) {
      return value && typeof value === "string" && value.startsWith("menu--")
        ? value.replace("menu--", "")
        : null;
    },
    encode(id) {
      return id ? `menu--${id}` : undefined;
    },
  });
}

export function useBudgetBlockMenuController(props: BudgetBlockMenuProps) {
  // Editing
  const { 1: setIsEditingId } = useBudgetEditorDialogVariableOpenState();
  const [menuId, setMenuId] = useBudgetBlockMenuDialogVariableOpenState();
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
