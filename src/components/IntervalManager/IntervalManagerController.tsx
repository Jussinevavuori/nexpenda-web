import React from "react"
import { useStoreActions, useStoreState } from "../../store"
import { IntervalManagerView } from "./IntervalManagerView"

export type IntervalManagerProps = {
	hideControls?: boolean;
}

export function IntervalManager(props: IntervalManagerProps) {

	const intervalString = useStoreState(_ => _.interval.smartDisplayString)
	const includesToday = useStoreState(_ => _.interval.includesToday)

	const today = useStoreActions(_ => _.interval.now)
	const previous = useStoreActions(_ => _.interval.previousInterval)
	const next = useStoreActions(_ => _.interval.nextInterval)

	return <IntervalManagerView

		hideControls={props.hideControls}

		intervalString={intervalString}
		onNext={() => next()}
		onPrevious={() => previous()}

		includesToday={includesToday}
		onToday={() => today()}

	/>
}