import "./AnalyticsBlock.scss"
import React from "react";
import cx from "classnames"
import { Type } from "../../../components/Type/Type";

export type AnalyticsBlockProps = {
	header?: string;
	headerIcon?: React.ReactNode;
	headerContent?: React.ReactNode;
} & React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>

export function AnalyticsBlock(props: AnalyticsBlockProps) {

	const {
		className,
		children,
		header,
		headerIcon,
		headerContent,
		...divProps
	} = props

	return <div
		className={cx("AnalyticsBlock", props.className)}
		{...divProps}
	>
		<div className="header">
			{headerIcon}
			<Type variant="bold">
				{header}
			</Type>
			<div className="header-content">
				{props.headerContent}
			</div>
		</div>
		<div className="content">
			{children}
		</div>
	</div>
}