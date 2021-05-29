import { useQueryState } from "../state/useQueryState";
import { ComponentState } from "./ComponentState";

export function useTransactionEditorDrawerVariableOpenState() {
  return useQueryState<null | string>({
    key: ComponentState.keys.TransactionEditorDrawer,
    method: "push",
    decode(encodedId) {
      return !!encodedId && typeof encodedId === "string" ? encodedId : null;
    },
    encode(id) {
      return id ?? undefined;
    },
  });
}
