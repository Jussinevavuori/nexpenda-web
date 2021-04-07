import "./AnalyticsBlock.scss"
import React from "react";
import cx from "classnames"
import { Type } from "../../../components/Type/Type";
import { TitleHighlightColumn } from "../../../components/TitleHighlightColumn/TitleHighlightColumn";

export type AnalyticsBlockProps = {
	header?: string;
	headerContent?: React.ReactNode;
} & React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>

export function AnalyticsBlock(props: AnalyticsBlockProps) {

	const {
		className,
		children,
		header,
		headerContent,
		...divProps
	} = props

	return <div
		className={cx("AnalyticsBlock", props.className)}
		{...divProps}
	>
		<div className="header">
			<TitleHighlightColumn color="primary-500" />
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