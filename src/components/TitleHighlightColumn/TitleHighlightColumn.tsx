import "./TitleHighlightColumn.scss";
import React from "react";
import cx from "classnames";
import { useIsDarkTheme } from "../../hooks/application/useIsThemeMode";

export type TitleHighlightColumnProps = {
	color?: Color;
};

export function TitleHighlightColumn(props: TitleHighlightColumnProps) {

	const isDarkTheme = useIsDarkTheme()

	return <div className={cx(
		"TitleHighlightColumn",
		`color-${props.color ?? (isDarkTheme ? "primary-400" : "primary-600")}`
	)} />
}