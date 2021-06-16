import { useOpenQueryState } from "../state/useOpenQueryState";
import { ComponentState } from "./ComponentState";

export function useTransactionCreatorOpenState() {
  return useOpenQueryState(ComponentState.keys.TransactionCreator);
}
