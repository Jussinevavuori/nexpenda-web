import { useEffect } from "react";
import { useBudgetCreatorDialogVariableOpenState } from "../../components/BudgetCreatorDialog/useBudgetCreatorDialogController";
import { useTransactionCreatorDrawerOpenState } from "../../components/TransactionCreatorDrawer/useTransactionCreatorDrawerController";
import { useStoreActions } from "../../store";
import { useRedirect } from "../utils/useRedirect";
import { useIsBudgetsLimitExceeded } from "./useIsBudgetsLimitExceeded";
import { useIsPremium } from "./useIsPremium";
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

  const isPremium = useIsPremium();

  const isTransactionsLimitExceeded = useIsTransactionsLimitExceeded();
  const isBudgetsLimitExceeded = useIsBudgetsLimitExceeded();

  /**
   * Automatically close transaction creation when limit exceeded.
   */
  useEffect(() => {
    if (isPremium) return;
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
    isPremium,
    openTransactionMenu,
    setOpenTransactionMenu,
    isTransactionsLimitExceeded,
  ]);

  /**
   * Automatically close budget creation when limit exceeded.
   */
  useEffect(() => {
    if (isPremium) return;
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
    isPremium,
    openBudgetMenu,
    setOpenBudgetMenu,
    isBudgetsLimitExceeded,
  ]);
}
