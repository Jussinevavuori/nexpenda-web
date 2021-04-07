import "./Type.scss";
import React, { ElementType, forwardRef } from "react"
import cx from "classnames"
import { Typography, TypographyProps } from "@material-ui/core";

export type TypeProps = Omit<TypographyProps, "color" | "variant"> & {
	component?: ElementType;
	color?: ThemeColor;
	variant?: "regular" | "bold" | "boldcaps";
	size?: "sm" | "md" | "lg" | "xl" | "xxl" | "xxxl";
	center?: boolean;
	disablePointerEvents?: boolean;
}

export const Type = forwardRef<HTMLElement, TypeProps>((props, ref) => {

	const {
		className,
		size,
		color,
		variant,
		center,
		disablePointerEvents,
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
			`Type-size-${textSize}`,
			{
				centered: center,
				pointerEventsDisabled: disablePointerEvents,
			}
		)}
	/>
})