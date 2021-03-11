import "./SubscriptionFrame.scss";
import React from "react";
import cx from "classnames";
// import { useSubscriptionFrameController } from "./useSubscriptionFrameController";
import { Logo } from "../Logo/Logo";

export type SubscriptionFrameProps = {
	headerContent?: React.ReactNode;
} & React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>

export function SubscriptionFrame(props: SubscriptionFrameProps) {
	// const controller = useSubscriptionFrameController(props)

	const { headerContent, children, className, ...divProps } = props


	return <div
		{...divProps}
		className={cx("SubscriptionFrame", className)}>
		<header className="stickyHeader">
			<div className="headerContent">
				<div className="logoContainer">
					<Logo color="white" />
				</div>
				<div className="authContainer">

				</div>
			</div>
		</header>
		<header className="customHeader">
			<div className="headerContent">
				{headerContent}
			</div>
		</header>
		<main>
			{children}
		</main>
	</div>
}