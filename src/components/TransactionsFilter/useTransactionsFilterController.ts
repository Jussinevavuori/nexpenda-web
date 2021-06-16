import { useEffect, useRef, useState } from "react";
import { useIsSearchOpen } from "../../hooks/application/useIsSearchOpen";
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

  // Utility ref to prevent debouncing from clearing fresh input when
  // a search is programmatically set simultaneously as the filter
  // component is programmatically opened.
  const isNowOpened = useRef(false);

  const { isOpen, handleOpen, handleClose } = useIsSearchOpen();

  const debouncedInput = useDebounce(input, 100);

  useEffect(() => {
    // If now opening the filter, mark it to the utility ref
    if (!isNowOpened.current) {
      isNowOpened.current = true;
      // If now opening ref, but debounced input is falsy, skip
      // updating in order to avoid overwriting programmatic opening
      // + value setting.
      if (!debouncedInput) {
        return;
      }
    }

    if (isOpen) {
      setSearchTerm(debouncedInput);
    } else {
      setSearchTerm("");
    }
  }, [debouncedInput, isOpen, setSearchTerm]);

  // When closed, reset the utility ref
  useEffect(() => {
    if (!isOpen) isNowOpened.current = false;
  }, [isOpen]);

  return {
    isOpen,
    onOpen: () => handleOpen(),
    onClose: () => handleClose(),
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
