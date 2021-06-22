import "./ErrorMessage.scss";
import React from "react";
import cx from "classnames";
import { Type, TypeProps } from "../Type/Type";
import { useIsDarkTheme } from "../../hooks/application/useIsThemeMode";

export type ErrorMessageProps = {
	children?: string;
	TypeProps?: TypeProps;
};

export function ErrorMessage(props: ErrorMessageProps) {
	const isDarkTheme = useIsDarkTheme()

	// No message
	if (!props.children) {
		return null
	}

	return <Type
		color={isDarkTheme ? "red-500" : "red-600"}
		{...props.TypeProps}
		className={cx("ErrorMessage", props.TypeProps?.className)}
		children={props.children}
	/>
}