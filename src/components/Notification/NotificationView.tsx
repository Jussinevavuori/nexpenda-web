import "./Notification.scss";
import React, { useMemo, useState } from "react"
import { Notification } from "../../lib/Notifications/Notification";
import { Alert } from "@material-ui/lab";
import { Button, Grow, Icon, IconButton, Snackbar } from "@material-ui/core";
import { TransitionProps } from "@material-ui/core/transitions";

export type NotificationViewProps = {
	notification: Notification;
	onClose(): void;
}

function GrowTransition(props: TransitionProps) {
	return <Grow {...props} />;
}

/**
 * @todo Darkmode
 */

export function NotificationView(props: NotificationViewProps) {

	const [open, setOpen] = useState(true)

	const action = useMemo(() => props.notification.action, [props])

	const actionElement = action ?
		action.buttonType === "iconButton"
			? <IconButton
				color="inherit"
				children={<Icon>{action.iconButtonIcon ?? "notification_important"}</Icon>}
				onClick={action.onClick}
			/>
			: <Button
				color="inherit"
				children={action.label}
				startIcon={action.startIcon ? <Icon>{action.startIcon}</Icon> : null}
				endIcon={action.endIcon ? <Icon>{action.endIcon}</Icon> : null}
				onClick={action.onClick}
			/>
		: null

	return <>
		<Snackbar
			className="Notification"
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
		>
			<Alert
				severity={props.notification.severity}
				variant={props.notification.variant}
				action={actionElement}
			>
				{props.notification.message}
			</Alert>
		</Snackbar>
	</>
}