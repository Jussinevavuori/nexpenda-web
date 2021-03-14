import { useCallback, useEffect } from "react";
import { DeleteTransactionEvent } from "../../history/DeleteTransactionEvent";
import { useStoreActions, useStoreState } from "../../store";
import { DeleteTransactionsEvent } from "../../history/DeleteTransactionsEvent";
import { LoggedOutEvent } from "../../history/LoggedOutEvent";
import { HistoryEvent } from "../../history/HistoryEvent";
import { DeleteBudgetEvent } from "../../history/DeleteBudgetEvent";

export function useHistoryNotifications() {
  const latest = useStoreState((_) => _.history.latest);
  const restore = useStoreActions((_) => _.history.restoreEvent);
  const notify = useStoreActions((_) => _.notification.notify);

  const notifyEvent = useCallback(
    <E extends HistoryEvent<any>>(event: E, message: string) => {
      notify({
        message,
        severity: "info",
        action: event.canBeRestored
          ? {
              onClick: () => restore(event.id),
              buttonType: "button",
              startIcon: "undo",
              label: "Undo",
            }
          : undefined,
      });
    },
    [notify, restore]
  );

  const handleDeleteTransactionEvent = useCallback(
    (e: DeleteTransactionEvent) => {
      notifyEvent(e, "Deleted transaction");
      e.displayed = true;
    },
    [notifyEvent]
  );

  const handleDeleteTransactionsEvent = useCallback(
    (e: DeleteTransactionsEvent) => {
      const n = e.transactions.length;
      notifyEvent(e, `Deleted ${n} transaction${n > 1 ? "s" : ""}`);
      e.displayed = true;
    },
    [notifyEvent]
  );

  const handleDeleteBudgetEvent = useCallback(
    (e: DeleteBudgetEvent) => {
      notifyEvent(e, "Deleted budget");
      e.displayed = true;
    },
    [notifyEvent]
  );

  const handleLoggedOutEvent = useCallback(
    (e: LoggedOutEvent) => {
      notifyEvent(e, `You have been logged out`);
      e.displayed = true;
    },
    [notifyEvent]
  );

  useEffect(() => {
    if (!latest || latest.displayed) return;

    if (latest instanceof DeleteTransactionEvent) {
      handleDeleteTransactionEvent(latest);
    } else if (latest instanceof DeleteTransactionsEvent) {
      handleDeleteTransactionsEvent(latest);
    } else if (latest instanceof LoggedOutEvent) {
      handleLoggedOutEvent(latest);
    } else if (latest instanceof DeleteBudgetEvent) {
      handleDeleteBudgetEvent(latest);
    }
  }, [
    latest,
    handleDeleteTransactionEvent,
    handleDeleteTransactionsEvent,
    handleLoggedOutEvent,
    handleDeleteBudgetEvent,
  ]);
}
