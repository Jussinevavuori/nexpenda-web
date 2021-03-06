import "./ContainerBlock.scss";
import React from "react";
import cx from "classnames";
import { TitleHighlightColumn } from "../TitleHighlightColumn/TitleHighlightColumn";
import { Type } from "../Type/Type";
import { useIsDarkTheme } from "../../hooks/application/useIsThemeMode";

export type ContainerBlockProps = {
	containerTitle?: string;
	startIcon?: React.ReactNode;
	endIcon?: React.ReactNode;
} & React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>;

export function ContainerBlock(props: ContainerBlockProps) {

	const { children, containerTitle, startIcon, endIcon, ...divProps } = props
	const isDarkTheme = useIsDarkTheme()

	return <div
		{...divProps}
		className={cx("ContainerBlock", props.className)}
	>
		{
			containerTitle &&
			<div className="header">
				<TitleHighlightColumn
					color={isDarkTheme ? "primary-400" : "primary-500"}
				/>
				{startIcon && <i className="start">{startIcon}</i>}
				<Type
					variant="boldcaps"
					color={isDarkTheme ? "gray-100" : "gray-900"}
				>
					{containerTitle}
				</Type>
				{endIcon && <i className="end">{endIcon}</i>}
			</div>
		}
		{children}
	</div >
}