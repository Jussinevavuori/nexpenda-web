import React, { useCallback, useMemo } from "react"
import { useStoreActions, useStoreState } from "../../store"
import { NotificationView } from "./NotificationView"

export type NotificationProps = {

}

export function Notification(props: NotificationProps) {

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

	if (activeNotification) {
		return <NotificationView
			key={activeNotification.id}
			notification={activeNotification}
			onClose={handleNotificationClose}
		/>
	}

	return null

}