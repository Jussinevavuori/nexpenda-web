import { useCallback } from "react";
import { useShortcut } from "./useShortcut";
import {
  parse as parseQueryString,
  stringify as createQueryString,
} from "query-string";
import { useHistory, useLocation } from "react-router-dom";
import { TransactionCreatorDrawerOpenQuery } from "../../components/TransactionCreatorDrawer/useTransactionCreatorDrawerController";
import { TransactionEditorDrawerOpenHash } from "../../components/TransactionEditorDrawer/useTransactionEditorDrawerController";

export function useCloseFormsShortcut() {
  const history = useHistory();
  const location = useLocation();

  const handler = useCallback(() => {
    const query = parseQueryString(location.search);
    const queryString = createQueryString({
      ...query,
      [TransactionEditorDrawerOpenHash]: undefined,
      [TransactionCreatorDrawerOpenQuery]: undefined,
    });

    history.replace({ search: queryString });
  }, [location.search, history]);

  useShortcut({ key: "Escape", enableForInputs: true }, handler);
}
