import React from "react"
import { NotificationView } from "./NotificationView"
import { useNotificationController } from "./useNotificationController"

export type NotificationProps = {

}

export function Notification(props: NotificationProps) {

	const controller = useNotificationController()

	if (controller.activeNotification) {
		return <NotificationView
			key={controller.activeNotification.id}
			notification={controller.activeNotification}
			onClose={controller.handleNotificationClose}
		/>
	}

	return null

}