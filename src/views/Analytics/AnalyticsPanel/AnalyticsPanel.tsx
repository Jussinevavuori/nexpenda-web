import React from "react";
import { IntervalManager } from "../../../components/IntervalManager/IntervalManager";
import "./AnalyticsPanel.scss";

export type AnalyticsPanelProps = {

}

export function AnalyticsPanel(props: AnalyticsPanelProps) {
	return <div className="AnalyticsPanel">
		<IntervalManager />
	</div>
}