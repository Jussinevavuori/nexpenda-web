import "./BetaFeatureBanner.scss";
import React from "react";
import cx from "classnames";
import { useBetaFeatureBannerController } from "./useBetaFeatureBannerController";
import { Type } from "../Type/Type";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@material-ui/core";
import { useIsDarkTheme } from "../../hooks/application/useIsThemeMode";

export type BetaFeatureBannerProps = {
	feature: string;
};

export function BetaFeatureBanner(props: BetaFeatureBannerProps) {

	const isDarkTheme = useIsDarkTheme()
	const controller = useBetaFeatureBannerController(props)

	return <AnimatePresence>
		{
			!controller.isDismissed &&
			<motion.div
				initial={{ opacity: 0, scale: 0, y: -20 }}
				animate={{ opacity: 1, scale: 1, y: 0 }}
				exit={{ opacity: 0, scale: 0, y: -20 }}
				className={cx("BetaFeatureBanner")}
			>
				<Type
					variant="bold"
					color={isDarkTheme ? "gray-200" : "gray-800"}
				>
					{`${props.feature} feature is currently in Beta`}
				</Type>

				<Type
					size="sm"
					color={isDarkTheme ? "gray-300" : "gray-700"}
				>
					{"You can use and test this feature already, however all features, "}
					{"implementation and design are not final and may change in the future. "}
				</Type>

				<Type
					size="sm"
					color={isDarkTheme ? "gray-300" : "gray-700"}
				>
					{"You may experience bugs with this feature. If you do, please contact "}
					{"us through your profile page."}
				</Type>

				<Button
					variant="contained"
					color="primary"
					onClick={controller.handleDismiss}
				>
					{"Dismiss"}
				</Button>
			</motion.div>
		}
	</AnimatePresence>
}