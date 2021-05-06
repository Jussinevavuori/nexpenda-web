import { useEffect } from "react";
import { useBudgetCreatorDialogVariableOpenState } from "../../components/BudgetCreatorDialog/useBudgetCreatorDialogController";
import { useTransactionCreatorDrawerOpenState } from "../../components/TransactionCreatorDrawer/useTransactionCreatorDrawerController";
import { useStoreActions } from "../../store";
import { useRedirect } from "../utils/useRedirect";
import { useIsBudgetsLimitExceeded } from "./useIsBudgetsLimitExceeded";
import { useIsTransactionsLimitExceeded } from "./useIsTransactionsLimitExceeded";

export function useBlockCreation() {
  const notify = useStoreActions((_) => _.notification.notify);
  const redirect = useRedirect();

  const [
    openTransactionMenu,
    setOpenTransactionMenu,
  ] = useTransactionCreatorDrawerOpenState();
  const [
    openBudgetMenu,
    setOpenBudgetMenu,
  ] = useBudgetCreatorDialogVariableOpenState();

  const isTransactionsLimitExceeded = useIsTransactionsLimitExceeded();
  const isBudgetsLimitExceeded = useIsBudgetsLimitExceeded();

  /**
   * Automatically close transaction creation when limit exceeded.
   */
  useEffect(() => {
    if (openTransactionMenu && isTransactionsLimitExceeded) {
      setOpenTransactionMenu(false);
      notify({
        message:
          `You have hit the limit of free transactions. ` +
          `Upgrade to Nexpenda premium to continue creating ` +
          `more transactions.`,
        severity: "error",
        action: {
          buttonType: "button",
          label: "Upgrade",
          onClick() {
            redirect((_) => _.subscribe);
          },
        },
      });
    }
  }, [
    notify,
    redirect,
    openTransactionMenu,
    setOpenTransactionMenu,
    isTransactionsLimitExceeded,
  ]);

  /**
   * Automatically close budget creation when limit exceeded.
   */
  useEffect(() => {
    if (openBudgetMenu && isBudgetsLimitExceeded) {
      setOpenBudgetMenu(undefined);
      notify({
        message:
          `You have hit the limit of free budgets. ` +
          `Upgrade to Nexpenda premium to continue creating ` +
          `more budgets.`,
        severity: "error",
        action: {
          buttonType: "button",
          label: "Upgrade",
          onClick() {
            redirect((_) => _.subscribe);
          },
        },
      });
    }
  }, [
    notify,
    redirect,
    openBudgetMenu,
    setOpenBudgetMenu,
    isBudgetsLimitExceeded,
  ]);
}
