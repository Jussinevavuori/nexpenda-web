import "./SettingsSubscriptionManager.scss";
import React from "react";
import cx from "classnames";
import { useSettingsSubscriptionManagerController } from "./useSettingsSubscriptionManagerController";
import { Type } from "../Type/Type";
import { Button } from "@material-ui/core";
import { isFuture } from "date-fns";
import { useIsDarkTheme } from "../../hooks/application/useIsThemeMode";

export type SettingsSubscriptionManagerProps = {

};

export function SettingsSubscriptionManager(props: SettingsSubscriptionManagerProps) {

	const controller = useSettingsSubscriptionManagerController(props)
	const isDarkTheme = useIsDarkTheme()

	return <div className={cx("SettingsSubscriptionManager")}>

		<div className="currentSubscription">
			<ul>
				{
					controller.subscriptions.length === 0 &&
					<Type component="li" className="noSubscriptions">
						{"You don't have any subscriptions"}
					</Type>
				}
				{
					controller.subscriptions.map(subscription => {
						const sub = subscription.data

						const isActive = sub.status === "active"

						const start = (() => {
							const date = new Date(sub.start_date * 1000)
							const datestring = date.toLocaleDateString()
							return `Started ${datestring}`
						})()

						const end = (() => {
							const timestamp = sub.cancel_at ?? sub.canceled_at
							if (!timestamp) {
								return undefined
							}
							const date = new Date(timestamp * 1000)
							const datestring = date.toLocaleDateString()
							if (isFuture(date)) {
								return `Will automatically end ${datestring}`
							} else {
								return `Ended ${datestring}`
							}
						})()

						return <li key={sub.id}>
							<Type component="h5" variant="bold">
								{"Nexpenda Premium"}
							</Type>
							<Type
								component="p"
								className={cx("activeStatus", { isActive })}
								color={isActive
									? (isDarkTheme ? "primary-400" : "primary-600")
									: (isDarkTheme ? "gray-400" : "gray-600")}
								variant="bold"
								size="sm"
							>
								{isActive ? "Active" : "Ended"}
							</Type>
							{
								start &&
								<Type
									component="p"
									color={isDarkTheme ? "gray-400" : "gray-700"}
									size="sm"
								>
									{start}
								</Type>
							}
							{
								end &&
								<Type
									component="p"
									color={isDarkTheme ? "gray-400" : "gray-700"}
									size="sm"
								>
									{end}
								</Type>
							}
						</li>
					})
				}
			</ul>
		</div>

		<Button variant="outlined" onClick={controller.handleManageBilling} fullWidth>
			{"Manage billing"}
		</Button>

	</div>
}