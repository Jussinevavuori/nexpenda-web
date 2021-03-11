import "./SubscriptionFrame.scss";
import React from "react";
import cx from "classnames";
import { useSubscriptionFrameController } from "./useSubscriptionFrameController";
import { Logo } from "../Logo/Logo";
import { IconButton } from "@material-ui/core";
import { Type } from "../Type/Type";
import { Clear } from "@material-ui/icons";

export type SubscriptionFrameProps = {
	headerContent?: React.ReactNode;
} & React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>

export function SubscriptionFrame(props: SubscriptionFrameProps) {
	const controller = useSubscriptionFrameController(props)

	const { headerContent, children, className, ...divProps } = props

	if (!controller.user) {
		return null
	}

	return <div
		{...divProps}
		className={cx("SubscriptionFrame", className)}>
		<header className="stickyHeader">
			<div className="headerContent">
				<div className="logoContainer">
					<Logo color="white" premium />
				</div>
				<div className="authContainer">
					<div className="auth">
						<Type component="span" color="white">
							{controller.user.email}
						</Type>
					</div>
					<div className="back">
						<IconButton onClick={controller.onBack}>
							<Clear />
						</IconButton>
					</div>
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