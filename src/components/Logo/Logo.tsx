import "./Logo.scss";
import React from "react"
import IconLogoBlackColoredSvg from "../../images/icon-logo-colored.svg"
import IconLogoWhiteColoredSvg from "../../images/icon-logo-white-colored.svg"
import cx from "classnames"
import { Type, TypeProps } from "../Type/Type";
import { AnimatePresence, motion } from "framer-motion";
import { useThemeMode } from "../../hooks/application/useThemeMode";
// import { useLogoController } from "./useLogoController";

export type LogoProps = TypeProps & {
	defaultLetterProps?: TypeProps;
	highlightLetterProps?: TypeProps;
	premiumLetterProps?: TypeProps;

	premium?: boolean;

	/**
	 * Defaults to false
	 */
	showIcon?: boolean;

	/**
	 * Defaults to true
	 */
	showText?: boolean;
};

type LogoTypeVariant = "default" | "highlight" | "premium"

export function Logo(props: LogoProps) {
	const [themeMode] = useThemeMode()

	const {
		defaultLetterProps,
		highlightLetterProps,
		premiumLetterProps,
		premium,
		showIcon: propsShowIcon,
		showText: propsShowText,
		...typeProps
	} = props

	// const controller = useLogoController()

	const showIcon = propsShowIcon ?? false
	const showText = propsShowText ?? true

	const getProps = (variant: LogoTypeVariant): TypeProps => {
		switch (variant) {
			case "default":
				return {
					...defaultTypeProps["default"].default,
					...defaultTypeProps["default"][themeMode],
					...typeProps,
					...defaultLetterProps,
					className: cx(
						"defaultLetter",
						typeProps.className,
						defaultLetterProps?.className
					)
				}
			case "highlight":
				return {
					...defaultTypeProps["highlight"].default,
					...defaultTypeProps["highlight"][themeMode],
					...typeProps,
					...highlightLetterProps,
					className: cx(
						"highlightLetter",
						typeProps.className,
						highlightLetterProps?.className
					)
				}
			case "premium":
				return {
					...defaultTypeProps["premium"].default,
					...defaultTypeProps["premium"][themeMode],
					...typeProps,
					...premiumLetterProps,
					className: cx(
						"premiumLetter",
						typeProps.className,
						premiumLetterProps?.className
					)
				}

		}
	}

	return <span className={cx("Logo")}>
		<AnimatePresence>
			{
				showIcon &&
				<motion.span
					className="icon"
					transition={{ duration: 0.1 }}
					initial={{ opacity: 0, scaleX: 0, transformOrigin: "left" }}
					animate={{ opacity: 1, scaleX: 1, transformOrigin: "left" }}
					exit={{ opacity: 0, scaleX: 0, transformOrigin: "left" }}
				>
					<img
						src={themeMode === "dark" ? IconLogoWhiteColoredSvg : IconLogoBlackColoredSvg}
						alt="Nexpenda"
						className=""
					/>
				</motion.span>
			}
		</AnimatePresence>
		<AnimatePresence>
			{
				showText &&
				<motion.span
					className="text"
					transition={{ duration: 0.1 }}
					initial={{ opacity: 0, scaleX: 0, transformOrigin: "left" }}
					animate={{ opacity: 1, scaleX: 1, transformOrigin: "left" }}
					exit={{ opacity: 0, scaleX: 0, transformOrigin: "left" }}
				>
					<Type {...getProps("default")}>{"N"}</Type>
					<Type {...getProps("default")}>{"e"}</Type>
					<Type {...getProps("highlight")}>{"x"}</Type>
					<Type {...getProps("default")}>{"p"}</Type>
					<Type {...getProps("default")}>{"e"}</Type>
					<Type {...getProps("default")}>{"n"}</Type>
					<Type {...getProps("default")}>{"d"}</Type>
					<Type {...getProps("default")}>{"a"}</Type>

					{
						!premium &&
						<Type {...getProps("default")}>{"."}</Type>
					}

					{
						premium && <>
							<Type {...getProps("premium")}>{"P"}</Type>
							<Type {...getProps("premium")}>{"r"}</Type>
							<Type {...getProps("premium")}>{"e"}</Type>
							<Type {...getProps("premium")}>{"m"}</Type>
							<Type {...getProps("premium")}>{"i"}</Type>
							<Type {...getProps("premium")}>{"u"}</Type>
							<Type {...getProps("premium")}>{"m"}</Type>
						</>
					}
				</motion.span>
			}
		</AnimatePresence>
	</span>
}

const defaultTypeProps: Record<LogoTypeVariant, Record<ThemeMode | "default", TypeProps>> = {
	default: {
		default: {
			component: "span",
			size: "xl",
			variant: "extrabold",
		},
		dark: {
			color: "white",
		},
		light: {
			color: "black"
		}
	},
	highlight: {
		default: {
			component: "span",
			size: "xl",
			variant: "extrabold",
		},
		dark: {
			color: "primary-500",
		},
		light: {
			color: "primary-500"
		}
	},
	premium: {
		default: {
			component: "span",
			size: "md",
			variant: "bold",
		},
		dark: {
			color: "primary-300",
		},
		light: {
			color: "primary-700"
		}
	}
}