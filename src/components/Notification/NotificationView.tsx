import "./Notification.scss";
import React, { useMemo, useState } from "react"
import { Notification } from "../../classes/Notification";
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

export function NotificationView(props: NotificationViewProps) {

	const [open, setOpen] = useState(true)

	const action = useMemo(() => props.notification.action, [props])

	const actionElement = action ?
		action.buttonType === "iconButton"
			? <IconButton
				color="inherit"
				children={<Icon children={action.iconButtonIcon ?? "notification_important"} />}
				onClick={action.onClick}
			/>
			: <Button
				color="inherit"
				children={action.label}
				startIcon={action.startIcon ? <Icon children={action.startIcon} /> : null}
				endIcon={action.endIcon ? <Icon children={action.endIcon} /> : null}
				onClick={action.onClick}
			/>
		: null

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