import { useCallback, useEffect } from "react";
import { DeleteTransactionEvent } from "../history/DeleteTransactionEvent";
import { useStoreActions, useStoreState } from "../store";
import { DeleteTransactionsEvent } from "../history/DeleteTransactionsEvent";

export function useHistoryNotifications() {
	const latest = useStoreState((_) => _.history.latest);

	const restore = useStoreActions(_ => _.history.restoreEvent)

	const notify = useStoreActions((_) => _.notification.notify);

	const notifyEvent = useCallback((eventId: string, message: string) => {
		notify({
			message,
			severity: "info",
			action: {
				onClick: (() => restore(eventId)),
				buttonType: "button",
				startIcon: "undo",
				label: "Undo",
			}
		})
	}, [notify, restore])

	useEffect(() => {
		if (!latest) return;

		if (latest instanceof DeleteTransactionEvent) {
			notifyEvent(latest.id, "Deleted transaction")
		}

		else if (latest instanceof DeleteTransactionsEvent) {
			notifyEvent(latest.id, [
				`Deleted`,
				latest.transactions.length,
				latest.transactions.length === 1 ? "transaction" : "transactions"
			].join(" "))
		}

	}, [latest, notifyEvent]);
}
