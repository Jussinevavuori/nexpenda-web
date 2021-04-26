import "./ViewContainer.scss";
import React from "react";
import { createClassnames } from "../../utils/Utils/createClassnames";

export type ViewContainerProps = {

	/**
	 * View header
	 */
	viewHeader?: React.ReactNode;

	/**
	 * View panel
	 */
	viewPanel?: React.ReactNode;

	/**
	 * Main content;
	 */
	children?: React.ReactNode;

	/**
	 * If scrollable, will allow view header to be scrolled out of view and
	 * the panel to stick to the top of the screen. Else the panel and view header
	 * will be stuck to the top of the screen.
	 */
	scrollable?: boolean;

};

export function ViewContainer(props: ViewContainerProps) {
	const cx = createClassnames({ scrollable: props.scrollable })

	return <div className={cx("ViewContainer")}>
		{props.viewHeader && <div className={cx("viewHeader")}>{props.viewHeader}</div>}
		{props.viewPanel && <div className={cx("viewPanel")}>{props.viewPanel}</div>}
		{props.children && <div className={cx("children")}>{props.children}</div>}
	</div>
}