import { BudgetEditorDrawerProps } from "./BudgetEditorDrawer";
import { useCallback, useMemo } from "react";
import { useQueryState } from "../../hooks/state/useQueryState";
import { useStoreState } from "../../store";

export const BudgetEditorDrawerOpenHash = "edit-budget";

export function useBudgetEditorDrawerVariableOpenState() {
  return useQueryState<null | string>({
    key: BudgetEditorDrawerOpenHash,
    method: "push",
    decode(encodedId) {
      return !!encodedId && typeof encodedId === "string" ? encodedId : null;
    },
    encode(id) {
      return id ?? undefined;
    },
  });
}

export function useBudgetEditorDrawerController(
  props: BudgetEditorDrawerProps
) {
  const [editingId, setEditingId] = useBudgetEditorDrawerVariableOpenState();

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
