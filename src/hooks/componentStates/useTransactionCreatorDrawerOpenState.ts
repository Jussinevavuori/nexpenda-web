import { useBooleanQueryState } from "../state/useBooleanQueryState";
import { ComponentState } from "./ComponentState";

export function useTransactionCreatorDrawerOpenState() {
  return useBooleanQueryState(
    ComponentState.keys.TransactionCreatorDrawer,
    "push",
    "open"
  );
}
