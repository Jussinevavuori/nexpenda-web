import { useCallback, useMemo } from "react"
import { useStoreActions, useStoreState } from "../../store"

export function useNotificationController() {


	const notifications = useStoreState(_ => _.notification.notifications)
	const deleteNotification = useStoreActions(_ => _.notification.deleteNotification)

	const activeNotification = useMemo(() => {
		return notifications[0]
	}, [notifications])

	const handleNotificationClose = useCallback(() => {
		if (activeNotification) {
			deleteNotification(activeNotification.id)
		}
	}, [activeNotification, deleteNotification])

	return {
		activeNotification,
		handleNotificationClose,
	}
}