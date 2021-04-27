import "./PremiumUserLock.scss";
import React from "react";
import cx from "classnames";
import { usePremiumUserLockController } from "./usePremiumUserLockController";
import { Lock } from "@material-ui/icons";

export type PremiumUserLockProps = {
	isLocked: boolean;
	children?: React.ReactNode | ((args: { isLocked: boolean }) => React.ReactNode);

	disableLockedOutDialog?: boolean;
};

/**
 * @todo Darkmode
 */


export function PremiumUserLock(props: PremiumUserLockProps) {

	const controller = usePremiumUserLockController(props)

	return <div
		className={cx("PremiumUserLock", { isLocked: controller.isLocked })}
		onClick={controller.handleClick}
	>

		{
			controller.isLocked && <div className="lock">
				<Lock />
			</div>
		}

		<div className="content">
			{
				typeof props.children === "function"
					? props.children({ isLocked: controller.isLocked })
					: props.children
			}
		</div>

	</div>
}