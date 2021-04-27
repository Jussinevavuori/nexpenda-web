import "./AutoLoginIndicator.scss";
import React from "react";
import cx from "classnames";
import { useAutoLoginIndicatorController } from "./useAutoLoginIndicatorController";
import { motion, AnimatePresence } from "framer-motion";
import { LinearProgress } from "@material-ui/core";
import { Type } from "../Type/Type";
import { useIsDarkTheme } from "../../hooks/application/useIsThemeMode";

export type AutoLoginIndicatorProps = {

};

export function AutoLoginIndicator(props: AutoLoginIndicatorProps) {

	const controller = useAutoLoginIndicatorController(props)
	const isDarkTheme = useIsDarkTheme()

	if (!controller.showAutoLogin) {
		return null
	}

	return <AnimatePresence>
		<motion.div className={cx("AutoLoginIndicator")}
			initial={{ opacity: 0, scale: 0.5, y: -40 }}
			animate={{ opacity: 1, scale: 1, y: 0 }}
			exit={{ opacity: 0, scale: 0.5, y: -40 }}
		>
			<Type color={isDarkTheme ? "primary-200" : "primary-800"}>
				{"Logging you in automatically..."}
			</Type>
			<LinearProgress variant="indeterminate" />
		</motion.div>
	</AnimatePresence>
}