import { useCallback, useEffect, useState } from "react";
import { useBooleanQueryState } from "../../hooks/state/useBooleanQueryState";
import { useDebounce } from "../../hooks/utils/useDebounce";
import { useStoreActions, useStoreState } from "../../store";
import { TransactionsFilterProps } from "./TransactionsFilter";

export function useTransactionsFilterController(
  props: TransactionsFilterProps
) {
  const setSearchTerm = useStoreActions((_) => _.transactions.setSearchTerm);
  const smartSearch = useStoreState((_) => _.transactions.smartSearch);

  const [input, setInput] = useState("");
  const [isInputFocused, setIsInputFocused] = useState(false);

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

    smartSearch,

    isInputFocused,
    handleInputBlur() {
      setIsInputFocused(false);
    },
    handleInputFocus() {
      setIsInputFocused(true);
    },
  };
}
