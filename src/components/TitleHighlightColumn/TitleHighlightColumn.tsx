import "./TitleHighlightColumn.scss";
import React from "react";
import cx from "classnames";

export type TitleHighlightColumnProps = {
	color?: ThemeColor;
};

export function TitleHighlightColumn(props: TitleHighlightColumnProps) {

	return <div className={cx(
		"TitleHighlightColumn",
		`color-${props.color ?? "primary-600"}`
	)} />
}