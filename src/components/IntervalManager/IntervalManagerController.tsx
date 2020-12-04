import React from "react"
import { useStoreActions, useStoreState } from "../../store"
import { IntervalManagerView } from "./IntervalManagerView"

export type IntervalManagerProps = {
	hideArrowButtons?: boolean;
}

export function IntervalManager(props: IntervalManagerProps) {

	const intervalString = useStoreState(_ => _.interval.smartDisplayString)

	const previous = useStoreActions(_ => _.interval.previousInterval)
	const next = useStoreActions(_ => _.interval.nextInterval)

	return <IntervalManagerView

		hideArrowButtons={props.hideArrowButtons}
		intervalString={intervalString}
		onNext={() => next()}
		onPrevious={() => previous()}

	/>
}