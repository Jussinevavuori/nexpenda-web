import "./ViewPanel.scss";
import React from "react";
import cx from "classnames";

export type ViewPanelProps = {
	className?: string;
	children?: React.ReactNode;
};

export function ViewPanel(props: ViewPanelProps) {
	return <div className={cx("ViewPanel", props.className)}>
		{props.children}
	</div>
}