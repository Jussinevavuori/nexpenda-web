import "./ThemePicker.scss";
import React from "react";
import cx from "classnames";
import { useThemePickerController } from "./useThemePickerController";

export type ThemePickerProps = {

};

export function ThemePicker(props: ThemePickerProps) {

	const controller = useThemePickerController(props)

	return <div className={cx("ThemePicker")}>
		<ul>
			{
				controller.allThemes.map(theme => {
					return <li
						className={cx("theme", {
							selected: controller.theme === theme
						})}
						key={theme}
						onClick={controller.getThemeChangeHandler(theme)}
						style={{
							backgroundColor: controller.getThemeColor(theme)
						}}
					/>
				})
			}
		</ul>
	</div>
}