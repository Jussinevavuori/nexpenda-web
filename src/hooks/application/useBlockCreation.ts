import { useEffect } from "react";
import { useStoreActions, useStoreState } from "../../store";
import { useBudgetCreatorOpenState } from "../componentStates/useBudgetCreatorOpenState";
import { useTransactionCreatorOpenState } from "../componentStates/useTransactionCreatorOpenState";
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
  const {
    isOpen: isTransactionCreatorOpen,
    handleClose: handleTransactionCreatorClose,
  } = useTransactionCreatorOpenState();

  /**
   * Access budget menu for closing it when required
   */
  const { isOpen: isBudgetCreatorOpen, handleClose: handleBudgetCreatorClose } =
    useBudgetCreatorOpenState();

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
    if (isTransactionCreatorOpen && isTransactionsLimitExceeded) {
      handleTransactionCreatorClose();
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
    isTransactionCreatorOpen,
    handleTransactionCreatorClose,
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
    if (isBudgetCreatorOpen && isBudgetsLimitExceeded) {
      handleBudgetCreatorClose();
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
    isBudgetCreatorOpen,
    handleBudgetCreatorClose,
    isBudgetsLimitExceeded,
  ]);
}
