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
				controller.allThemeColors.map(color => {
					return <PremiumUserLock
						key={color}
						isLocked={ThemeUtils.isPremiumThemeColor(color)}
					>
						{
							(args) => (<li
								className={cx("theme", "color", {
									selected: controller.themeColor === color,
									isLocked: args.isLocked,
								})}
								onClick={controller.getThemeColorChangeHandler(color)}
								style={{ backgroundColor: controller.getThemeColor(color) }}
							/>)
						}
					</PremiumUserLock>
				})
			}
		</ul>
		<ul>
			{
				controller.allThemeModes.map(mode => {
					return <li
						key={mode}
						className={cx("theme", "mode", mode, {
							selected: controller.themeMode === mode,
						})}
						onClick={controller.getThemeModeChangeHandler(mode)}
					/>
				})
			}
		</ul>
	</div>
}
