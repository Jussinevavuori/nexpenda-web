import { useCallback, useEffect, useState } from "react";
import { useBooleanQueryState } from "../../hooks/useBooleanQueryState";
import { useDebounce } from "../../hooks/useDebounce";
import { useStoreActions } from "../../store";
import { TransactionsFilterProps } from "./TransactionsFilter";

export function useTransactionsFilterController(
  props: TransactionsFilterProps
) {
  const setSearchTerm = useStoreActions((_) => _.transactions.setSearchTerm);

  const [input, setInput] = useState("");

  const [open, setOpen] = useBooleanQueryState("search", "replace", "open");
  const onOpen = useCallback(() => setOpen(true), [setOpen]);
  const onClose = useCallback(() => setOpen(false), [setOpen]);

  const debouncedInput = useDebounce(input, 100);

  useEffect(() => {
    if (open) {
      setSearchTerm(debouncedInput);
    } else {
      setSearchTerm("");
    }
  }, [debouncedInput, open, setSearchTerm]);

  return {
    open,
    onOpen,
    onClose,
    input,
    setInput,
  };
}
