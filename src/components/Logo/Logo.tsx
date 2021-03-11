import "./Logo.scss";
import React from "react"
import cx from "classnames"
import { Type, TypeProps } from "../Type/Type";
// import { useLogoController } from "./useLogoController";

export type LogoProps = TypeProps & {
	defaultLetterProps?: TypeProps;
	highlightLetterProps?: TypeProps;
};

export function Logo(props: LogoProps) {

	const { defaultLetterProps, highlightLetterProps, ...typeProps } = props

	// const controller = useLogoController()

	const getProps = (variant: "default" | "highlight"): TypeProps => {
		return {
			component: "span",
			size: "xl",
			variant: "bold",
			color: variant === "highlight" ? "primary-500" : "black",
			...typeProps,
			...(variant === "default" ? defaultLetterProps : highlightLetterProps)
		}
	}

	return <span className={cx("Logo")}>
		<Type {...getProps("default")}>{"N"}</Type>
		<Type {...getProps("default")}>{"e"}</Type>
		<Type {...getProps("highlight")}>{"x"}</Type>
		<Type {...getProps("default")}>{"p"}</Type>
		<Type {...getProps("default")}>{"e"}</Type>
		<Type {...getProps("default")}>{"n"}</Type>
		<Type {...getProps("default")}>{"d"}</Type>
		<Type {...getProps("default")}>{"a"}</Type>
		<Type {...getProps("default")}>{"."}</Type>
	</span>
}