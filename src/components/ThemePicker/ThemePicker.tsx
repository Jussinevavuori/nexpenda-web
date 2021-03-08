import "./ThemePicker.scss";
import React from "react";
import cx from "classnames";
import { useThemePickerController } from "./useThemePickerController";
import { PremiumUserLock } from "../PremiumUserLock/PremiumUserLock";
import { ThemeUtils } from "../../utils/ThemeUtils/ThemeUtils";

export type ThemePickerProps = {

};

export function ThemePicker(props: ThemePickerProps) {
	const controller = useThemePickerController(props)

	return <div className={cx("ThemePicker")}>
		<ul>
			{
				controller.allThemes.map(theme => {
					return <PremiumUserLock
						key={theme}
						isLocked={ThemeUtils.isPremiumTheme(theme)}
					>
						{
							(args) => (<li
								className={cx("theme", {
									selected: controller.theme === theme,
									isLocked: args.isLocked,
								})}
								onClick={controller.getThemeChangeHandler(theme)}
								style={{
									backgroundColor: controller.getThemeColor(theme)
								}}
							/>)
						}
					</PremiumUserLock>
				})
			}
		</ul>
	</div>
}