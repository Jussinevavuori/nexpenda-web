import React from "react";
import { IntervalManager } from "../../../components/IntervalManager/IntervalManager";
import { useMdMedia } from "../../../hooks/utils/useMedia";
import "./AnalyticsPanel.scss";

export type AnalyticsPanelProps = {

}

export function AnalyticsPanel(props: AnalyticsPanelProps) {

	const isDesktopLayout = useMdMedia()

	return <div className="AnalyticsPanel">
		<IntervalManager reverseControls={!isDesktopLayout} />
	</div>
}