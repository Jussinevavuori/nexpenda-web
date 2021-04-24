import "./ContainerBlock.scss";
import React from "react";
import cx from "classnames";
import { TitleHighlightColumn } from "../TitleHighlightColumn/TitleHighlightColumn";
import { Type } from "../Type/Type";

export type ContainerBlockProps = {
	containerTitle?: string;
} & React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>;

export function ContainerBlock(props: ContainerBlockProps) {

	const { children, containerTitle, ...divProps } = props

	return <div
		{...divProps}
		className={cx("ContainerBlock", props.className)}
	>
		{
			containerTitle &&
			<div className="header">
				<TitleHighlightColumn color="primary-500" />
				<Type variant="boldcaps">
					{containerTitle}
				</Type>
			</div>
		}
		{children}
	</div >
}