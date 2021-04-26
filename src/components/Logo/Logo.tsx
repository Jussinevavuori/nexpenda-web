import "./Logo.scss";
import React from "react"
import IconLogoColoredSvg from "../../images/icon-logo-colored.svg"
import cx from "classnames"
import { Type, TypeProps } from "../Type/Type";
import { AnimatePresence, motion } from "framer-motion";
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

export function Logo(props: LogoProps) {

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

	const getProps = (variant: "default" | "highlight" | "premium"): TypeProps => {
		switch (variant) {
			case "default":
				return {
					component: "span",
					size: "xl",
					variant: "extrabold",
					color: "black",
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
					component: "span",
					size: "xl",
					variant: "extrabold",
					color: "primary-500",
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
					component: "span",
					size: "md",
					variant: "bold",
					color: "primary-700",
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
						src={IconLogoColoredSvg}
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