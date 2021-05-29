import { useEffect } from "react";
import { useStoreActions, useStoreState } from "../../store";
import { useBudgetCreatorDialogVariableOpenState } from "../componentStates/useBudgetCreatorDialogVariableOpenState";
import { useTransactionCreatorDrawerOpenState } from "../componentStates/useTransactionCreatorDrawerOpenState";
import { useRedirect } from "../utils/useRedirect";
import { useIsBudgetsLimitExceeded } from "./useIsBudgetsLimitExceeded";
import { useIsPremium } from "./useIsPremium";
import { useIsTransactionsLimitExceeded } from "./useIsTransactionsLimitExceeded";

export function useBlockCreation() {
  const notify = useStoreActions((_) => _.notification.notify);
  const redirect = useRedirect();

  /**
   * Check if the user is loaded to prevent early blocking
   */
  const isUserLoaded = useStoreState((_) => _.auth.initialized);

  /**
   * Check if the user is a premium user
   */
  const isPremium = useIsPremium();

  /**
   * Access transaction menu for closing it when required
   */
  const [isTransactionMenuOpen, setIsTransactionMenuOpen] =
    useTransactionCreatorDrawerOpenState();

  /**
   * Access budget menu for closing it when required
   */
  const [isBudgetMenuOpen, setIsBudgetMenuOpen] =
    useBudgetCreatorDialogVariableOpenState();

  /**
   * Check if the current transaction limit has been exceeded
   */
  const isTransactionsLimitExceeded = useIsTransactionsLimitExceeded();

  /**
   * Check if the current budgets limit has been exceeded
   */
  const isBudgetsLimitExceeded = useIsBudgetsLimitExceeded();

  /**
   * Automatically close transaction creation when limit exceeded.
   */
  useEffect(() => {
    // Do not close when user not yet loaded
    if (!isUserLoaded) return;

    // Do not close if premium
    if (isPremium) return;

    // Close transactions menu if exceeded
    if (isTransactionMenuOpen && isTransactionsLimitExceeded) {
      setIsTransactionMenuOpen(false);
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
    isUserLoaded,
    isTransactionMenuOpen,
    setIsTransactionMenuOpen,
    isTransactionsLimitExceeded,
  ]);

  /**
   * Automatically close budget creation when limit exceeded.
   */
  useEffect(() => {
    // Do not close when user not yet loaded
    if (!isUserLoaded) return;

    // Do not close if premium
    if (isPremium) return;

    // Close budget menu if exceeded
    if (isBudgetMenuOpen && isBudgetsLimitExceeded) {
      setIsBudgetMenuOpen(undefined);
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
    isUserLoaded,
    isBudgetMenuOpen,
    setIsBudgetMenuOpen,
    isBudgetsLimitExceeded,
  ]);
}
