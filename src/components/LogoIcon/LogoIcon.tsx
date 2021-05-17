import "./LogoIcon.scss";
import React from "react";
import cx from "classnames";
import { SvgPath } from "../../utils/SvgUtils/SvgPath";
import { useIsDarkTheme } from "../../hooks/application/useIsThemeMode";

export type LogoIconProps = {
	color?: Color;
	baseColor?: "black" | "white";
	id?: string;
}

export function LogoIcon(props: LogoIconProps) {

	const isDarkTheme = useIsDarkTheme()

	return <svg
		viewBox={SvgPath.describeLogoPath().viewBox}
		className={cx("LogoIcon")}
	>
		<path
			d={SvgPath.describeLogoPath().basePath}
			className={cx(
				"base",
				`color-${props.baseColor ?? (isDarkTheme ? "white" : "black")}`
			)}
		/>
		<path
			d={SvgPath.describeLogoPath().highlightPath}
			className={cx(
				"highlight",
				`color-${props.color ?? "primary-500"}`
			)}
		/>
	</svg >
}