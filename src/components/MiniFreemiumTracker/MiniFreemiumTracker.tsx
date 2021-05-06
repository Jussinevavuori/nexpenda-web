import "./MiniFreemiumTracker.scss";
import React from "react";
import cx from "classnames";
import { useMiniFreemiumTrackerController } from "./useMiniFreemiumTrackerController";
import { PercentageCircle } from "../PercentageCircle/PercentageCircle";
import { CircularProgress } from "@material-ui/core";

export type MiniFreemiumTrackerProps = {
	variant?: "transaction" | "budget"
	className?: string;
};

export function MiniFreemiumTracker(props: MiniFreemiumTrackerProps) {

	const controller = useMiniFreemiumTrackerController(props)

	if (controller.isPremium) return null

	return <div className={cx("MiniFreemiumTracker", props.className)}>

		{
			controller.isDefaultAppConfig
				? <CircularProgress
					size={44}
				/>
				: <button onClick={controller.handleOpen}>
					<PercentageCircle
						size={44}
						percentage={controller.percentage}
						filledColor={
							controller.limitExceeded
								? "red-400"
								: undefined
						}
					/>
				</button>
		}

	</div>
}