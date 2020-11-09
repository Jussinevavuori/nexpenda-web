import "./Skeleton.scss";
import React, { useState } from "react"
import cx from "classnames"


type SkeletonRandomizer = {
	min: number;
	max: number;
	unit: "%" | "px" | "rem" | "em";
}

type Dimension = number | string | SkeletonRandomizer

export type SkeletonProps = {
	width: Dimension;
	height: Dimension;

	className?: string;
}

function getValue(value: Dimension) {
	if (typeof value === "object") {
		const d = value.max - value.min
		const rnd = Math.random()
		const random = (d * rnd) + value.min
		return `${random}${value.unit}`
	} else {
		return value
	}
}

export function Skeleton(props: SkeletonProps) {

	const [width,] = useState(() => getValue(props.width))
	const [height,] = useState(() => getValue(props.height))

	const className = cx(props.className, "Skeleton")

	return <div
		className={className}
		style={{ width, height }}
	>
		<div className="SkeletonInner" />
	</div>
}

export function SkeletonType(props: Omit<SkeletonProps, "height">) {

	return <Skeleton
		{...props}
		height="16px"
	/>

}