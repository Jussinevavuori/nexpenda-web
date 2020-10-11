import "./Notification.scss";
import React, { useState } from "react"
import { Notification } from "../../classes/Notification";
import { Alert } from "@material-ui/lab";
import { Grow, Snackbar } from "@material-ui/core";
import { TransitionProps } from "@material-ui/core/transitions";

export type NotificationViewProps = {
	notification: Notification;
	onClose(): void;
}

function GrowTransition(props: TransitionProps) {
	return <Grow {...props} />;
}

export function NotificationView(props: NotificationViewProps) {

	const [open, setOpen] = useState(true)

	return <>
		<Snackbar
			id={props.notification.id}
			open={open}
			onClose={() => setOpen(false)}
			onExited={props.onClose}
			autoHideDuration={props.notification.timeout}
			anchorOrigin={{
				vertical: props.notification.verticalPosition,
				horizontal: props.notification.horizontalPosition,
			}}
			TransitionComponent={GrowTransition}
			action={props.notification.action}
		>
			<Alert
				severity={props.notification.severity}
				variant={props.notification.variant}
			>
				{props.notification.message}
			</Alert>
		</Snackbar>
	</>
}