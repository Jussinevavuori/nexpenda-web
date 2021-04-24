import { BudgetEditorDialogProps } from "./BudgetEditorDialog";
import { useCallback, useMemo } from "react";
import { useQueryState } from "../../hooks/state/useQueryState";
import { useStoreState } from "../../store";

export const BudgetEditorDialogOpenHash = "edit-budget";

export function useBudgetEditorDialogVariableOpenState() {
  return useQueryState<null | string>({
    key: BudgetEditorDialogOpenHash,
    method: "push",
    decode(encodedId) {
      return !!encodedId && typeof encodedId === "string" ? encodedId : null;
    },
    encode(id) {
      return id ?? undefined;
    },
  });
}

export function useBudgetEditorDialogController(
  props: BudgetEditorDialogProps
) {
  const [editingId, setEditingId] = useBudgetEditorDialogVariableOpenState();

  const budgets = useStoreState((_) => _.budgets.items);

  const budget = useMemo(() => {
    return budgets.find((_) => _.id === editingId);
  }, [budgets, editingId]);

  const handleClose = useCallback(() => {
    setEditingId(null);
  }, [setEditingId]);

  return {
    isOpen: !!budget,
    budget,
    handleClose,
  };
}
