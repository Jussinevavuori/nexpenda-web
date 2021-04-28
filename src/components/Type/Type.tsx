import "./Type.scss";
import React, { ElementType, forwardRef } from "react"
import cx from "classnames"
import { Typography, TypographyProps } from "@material-ui/core";
import { useIsDarkTheme } from "../../hooks/application/useIsThemeMode";

export type TypeProps = Omit<TypographyProps, "color" | "variant"> & {
	component?: ElementType;
	color?: Color;
	variant?: TextVariant;
	size?: TextSize;
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

	const isDarkTheme = useIsDarkTheme()

	const textColor = color ?? (isDarkTheme ? "gray-100" : "gray-900")
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
				hasOnClickEvent: !!props.onClick,
			}
		)}
	/>
})