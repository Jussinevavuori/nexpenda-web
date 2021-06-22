import "./FreemiumTracker.scss";
import React from "react";
import { useFreemiumTrackerController } from "./useFreemiumTrackerController";
import { PercentageCircle } from "../PercentageCircle/PercentageCircle";
import { Type } from "../Type/Type";
import { useIsDarkTheme } from "../../hooks/application/useIsThemeMode";
import { createClassnames } from "../../lib/Utilities/createClassnames";
import { ContainerBlock } from "../Container/ContainerBlock";
import { Button, CircularProgress, Tooltip } from "@material-ui/core";
import { Star } from "@material-ui/icons";
import { Link } from "react-router-dom";
import { routes } from "../../Routes";

export type FreemiumTrackerProps = {

	hideTransactions?: boolean;
	hideBudgets?: boolean;

	hideUpgradeButton?: boolean;
	variant?: "minimal" | "default"

	size?: "container" | "full"
};

export function FreemiumTracker(props: FreemiumTrackerProps) {

	const controller = useFreemiumTrackerController(props)
	const isDarkTheme = useIsDarkTheme()
	const cx = createClassnames(`variant-${props.variant ?? "default"}`)

	if (controller.isPremium || !controller.isUserLoaded) return null

	return <ContainerBlock
		className={cx(
			"FreemiumTracker",
			`size-${props.size ?? "container"}`,
			{
				upgradeButtonHidden: props.hideUpgradeButton,
			}
		)}
		containerTitle={props.variant === "default" ? "Free limits" : undefined}
	>

		{
			controller.isDefaultAppConfig
				? <div className="limits">
					<CircularProgress />
				</div>
				: <div className="limits">
					{
						!props.hideTransactions &&
						<Tooltip
							title={<div className="FreemiumTracker__tooltip">
								<Type variant="bold" color={isDarkTheme ? "white" : "gray-800"}>
									{"Transactions"}
								</Type>
								<Type color={isDarkTheme ? "white" : "gray-800"}>
									{controller.transactionsCount}
									{" / "}
									{controller.transactionsLimit}
									{` (${controller.transactionsPercentage.toFixed(1)} %)`}
								</Type>
								<Type
									color={isDarkTheme ? "white" : "gray-800"}
									className="left"
								>
									{controller.transactionsLeft}
									{" free transactions left"}
								</Type>
							</div>}
						>
							<div className={cx("limit")}>
								<Type variant="bold" className={cx("title")}>
									{"Transactions"}
								</Type>
								<div className={cx("percentage")}>
									<PercentageCircle
										size={44}
										percentage={controller.transactionsPercentage}
										filledColor={controller.transactionsLimitExceeded ? "red-600" : undefined}
									/>
								</div>
								<Type
									className={cx("value")}
									color={
										controller.transactionsLimitExceeded
											? isDarkTheme ? "red-700" : "red-500"
											: undefined
									}
								>
									{controller.transactionsCount}
									{" / "}
									{controller.transactionsLimit}
								</Type>
							</div>
						</Tooltip>
					}

					{
						!props.hideBudgets &&
						<Tooltip
							title={<div className="FreemiumTracker__tooltip">
								<Type variant="bold" color={isDarkTheme ? "white" : "gray-800"}>
									{"Budgets"}
								</Type>
								<Type color={isDarkTheme ? "white" : "gray-800"}>
									{controller.budgetsCount}
									{" / "}
									{controller.budgetsLimit}
									{` (${controller.budgetsPercentage.toFixed(1)} %)`}
								</Type>
								<Type
									color={isDarkTheme ? "white" : "gray-800"}
									className="left"
								>
									{controller.budgetsLeft}
									{" free budgets left"}
								</Type>
							</div>}
						>
							<div className={cx("limit")}>
								<Type variant="bold" className={cx("title")}>
									{"Budgets"}
								</Type>
								<div className={cx("percentage")}>
									<PercentageCircle
										size={44}
										percentage={controller.budgetsPercentage}
										filledColor={controller.budgetsLimitExceeded ? "red-600" : undefined}
									/>
								</div>
								<Type
									className={cx("value")}
									color={
										controller.budgetsLimitExceeded
											? isDarkTheme ? "red-700" : "red-500"
											: undefined
									}
								>
									{controller.budgetsCount}
									{" / "}
									{controller.budgetsLimit}
								</Type>
							</div>
						</Tooltip>
					}
				</div>

		}

		{
			!props.hideUpgradeButton &&
			<Tooltip
				title={<div className="FreemiumTracker__tooltip">
					<div>
						<Type component="span" size="sm">
							{"Upgrade to "}
						</Type>
						<Type component="span" variant="bold" size="sm">
							{"Nexpenda Premium "}
						</Type>
						<Type component="span" size="sm">
							{"to unlock unlimited resources"}
						</Type>
					</div>
					<div className="left">
						<Type component="span" size="sm" variant="bold">
							{"Learn more..."}
						</Type>
					</div>
				</div>}
			>
				<Link to={routes.subscribe.path}>
					<Button
						className={cx("upgradeButton")}
						variant="contained"
						color="primary"
						startIcon={<Star />}
					>
						<span className={cx("buttonLabel")}>
							{"Upgrade"}
						</span>
					</Button>
				</Link>
			</Tooltip>
		}

	</ContainerBlock>
}