import "./MoneyType.scss";
import React, { useEffect, useMemo, useRef } from "react"
import cx from "classnames"
import { MoneyAmount } from "../../lib/Money/MoneyAmount";
import { Type, TypeProps } from "../Type/Type";
import { animate } from "framer-motion"

export type MoneyTypeProps = {
	amount: MoneyAmount | number;

	colorIfNegative?: TypeProps["color"];
	colorIfPositive?: TypeProps["color"];

	animate?: boolean;
	disableAnimationBlur?: boolean;
	animationDuration?: number;
	animationStiffness?: number;
} & TypeProps

export function MoneyType(props: MoneyTypeProps) {

	const {
		amount,

		className,

		color,
		colorIfNegative,
		colorIfPositive,

		animate: enableAnimation,
		animationDuration,
		animationStiffness,
		disableAnimationBlur,
		...typeProps
	} = props

	const moneyAmount = useMemo(() => typeof amount === "number"
		? new MoneyAmount(amount)
		: amount, [amount])

	/**
	 * Ref to the real component for updating the text value
	 */
	const nodeRef = useRef<HTMLSpanElement | null>(null)

	/**
	 * Keeping track of the latest value stored in this MoneyType component
	 * for animation
	 */
	const latestValueRef = useRef<number>(0)

	/**
	 * Animating the text amount, if animations are enabled.
	 */
	useEffect(() => {
		const node = nodeRef.current

		if (!enableAnimation || !node) {
			return
		}

		const start = latestValueRef.current
		const end = moneyAmount.value

		const controls = animate(start, end, {
			duration: animationDuration ?? 0.5,
			stiffness: animationStiffness ?? 1,
			onUpdate(value) {

				// Format new value and show new value
				const integerValue = Math.round(value)
				const formattedValue = MoneyAmount.format(integerValue)

				node.textContent = formattedValue

				// Show blurring, fading and scaling animation while transitioning
				if (!disableAnimationBlur) {

					// Get progress from start to finish as percentage
					const progress = Math.abs(end - value) / Math.abs(end - start)

					// Get phase from 0 to Pi and its sin-value
					const phase = progress * Math.PI
					const sin = Math.sin(phase)
					const sin2 = sin * sin

					node.style.opacity = `${Math.max(1 - sin2, 0.75)}`
					node.style.filter = `blur(${3 * sin2}px)`
				}

				// Update the latest value 
				latestValueRef.current = value
			},
		})

		return () => controls.stop()
	}, [enableAnimation, moneyAmount, animationDuration, animationStiffness, disableAnimationBlur])

	return <span className={cx("MoneyType", className, {
		positive: moneyAmount.isNonNegative,
		negative: moneyAmount.isNegative,
	})}>
		<Type
			ref={nodeRef}
			variant="bold"
			color={
				moneyAmount.isNegative
					? colorIfNegative ?? color
					: colorIfPositive ?? color
			}
			{...typeProps}
		>
			{moneyAmount.format()}
		</Type>
	</span >
}