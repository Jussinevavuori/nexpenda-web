import "./Type.scss";
import React, { ElementType, forwardRef } from "react"
import cx from "classnames"
import { Typography, TypographyProps } from "@material-ui/core";

export type TypeProps = Omit<TypographyProps, "color" | "variant"> & {
	component?: ElementType;

	color?:
	| "white"
	| "black"
	| "blue-100"
	| "blue-200"
	| "blue-300"
	| "blue-400"
	| "blue-500"
	| "blue-600"
	| "blue-700"
	| "blue-800"
	| "blue-900"
	| "gray-100"
	| "gray-200"
	| "gray-300"
	| "gray-400"
	| "gray-500"
	| "gray-600"
	| "gray-700"
	| "gray-800"
	| "gray-900"
	| "red-100"
	| "red-200"
	| "red-300"
	| "red-400"
	| "red-500"
	| "red-600"
	| "red-700"
	| "red-800"
	| "red-900"
	| "green-100"
	| "green-200"
	| "green-300"
	| "green-400"
	| "green-500"
	| "green-600"
	| "green-700"
	| "green-800"
	| "green-900"
	| "primary-100"
	| "primary-200"
	| "primary-300"
	| "primary-400"
	| "primary-500"
	| "primary-600"
	| "primary-700"
	| "primary-800"
	| "primary-900"

	variant?: "regular" | "bold" | "boldcaps";

	size?: "sm" | "md" | "lg" | "xl" | "xxl" | "xxxl";

}

export const Type = forwardRef<HTMLElement, TypeProps>((props, ref) => {

	const {
		className,
		size,
		color,
		variant,
		...typographyProps
	} = props

	const textColor = color ?? "gray-900"
	const textVariant = variant ?? "regular"
	const textSize = size ?? "md"

	return <Typography

		ref={ref}

		{...typographyProps}

		className={cx(
			"Type",
			className,
			`Type-color-${textColor}`,
			`Type-variant-${textVariant}`,
			`Type-size-${textSize}`
		)}
	/>
})