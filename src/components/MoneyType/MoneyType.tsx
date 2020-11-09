import "./MoneyType.scss";
import React, { useEffect, useRef } from "react"
import cx from "classnames"
import { MoneyAmount } from "../../classes/MoneyAmount";
import { Type, TypeProps } from "../Type/Type";
import { animate } from "framer-motion"

export type MoneyTypeProps = {
	amount: MoneyAmount;
	applyColor?: boolean;
	bold?: boolean;
	animate?: boolean;
	disableAnimationBlur?: boolean;
	animationDuration?: number;
	animationStiffness?: number;
} & TypeProps

export function MoneyType(props: MoneyTypeProps) {

	const {
		amount,
		applyColor,
		bold,
		animate: enableAnimation,
		animationDuration,
		animationStiffness,
		disableAnimationBlur,
		...typeProps
	} = props

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
		const end = amount.value

		const controls = animate(start, end, {
			duration: animationDuration ?? 0.8,
			stiffness: animationStiffness ?? 1,
			ease: "easeOut",
			onUpdate(value) {

				// Format new value and show new value
				const integerValue = Math.round(value)
				const formattedValue = MoneyAmount.format(integerValue)
				node.textContent = formattedValue

				// Show blurring, fading and scaling animation while transitioning:
				//
				// For transitioning we calculate the distance ratio, which is a value
				// that linearly starts from 0, peaks at 1 during the midpoint of the
				// transition and ends at 0. Similarly we use its opposite, which
				// is equal, but opposite such that it starts and ends at 1 and goes
				// through zero.
				if (!disableAnimationBlur) {
					const distanceStart = Math.abs(value - start)
					const distanceEnd = Math.abs(end - value)
					const maxDistance = Math.abs(end - start)
					const minDistance = Math.min(distanceStart, distanceEnd)
					const distanceRatio = 2 * (minDistance / maxDistance)
					const oppositeDistanceRatio = 1 - distanceRatio
					node.style.opacity = `${Math.max(oppositeDistanceRatio, 0.75)}`
					node.style.filter = `blur(${3 * distanceRatio}px)`
				}

				// Update the latest value 
				latestValueRef.current = value
			},
		})

		return () => controls.stop()
	}, [enableAnimation, amount, animationDuration, animationStiffness, disableAnimationBlur])

	return <span className={cx("MoneyType", {
		bold,
		applyColor,
		positive: props.amount.isNonNegative,
		negative: props.amount.isNegative,
	})}>
		<Type
			condensed
			{...typeProps}
			component="span"
			ref={nodeRef}
		>
			{amount.format()}
		</Type>
	</span >
}