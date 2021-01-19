import { useCallback, useEffect } from "react";
import { DeleteTransactionEvent } from "../history/DeleteTransactionEvent";
import { useStoreActions, useStoreState } from "../store";
import { DeleteTransactionsEvent } from "../history/DeleteTransactionsEvent";

export function useHistoryNotifications() {
  const latest = useStoreState((_) => _.history.latest);

  const restore = useStoreActions((_) => _.history.restoreEvent);

  const notify = useStoreActions((_) => _.notification.notify);

  const notifyEvent = useCallback(
    (eventId: string, message: string) => {
      notify({
        message,
        severity: "info",
        action: {
          onClick: () => restore(eventId),
          buttonType: "button",
          startIcon: "undo",
          label: "Undo",
        },
      });
    },
    [notify, restore]
  );

  useEffect(() => {
    if (!latest || latest.displayed) return;

    if (latest instanceof DeleteTransactionEvent) {
      notifyEvent(latest.id, "Deleted transaction");
      latest.displayed = true;
    } else if (latest instanceof DeleteTransactionsEvent) {
      const n = latest.transactions.length;
      notifyEvent(latest.id, `Deleted ${n} transaction${n > 1 ? "s" : ""}`);
      latest.displayed = true;
    }
  }, [latest, notifyEvent]);
}
