import "./Analytics.scss";
import React from "react"
import { Type } from "react-feather";

export type AnalyticsViewProps = {

}

export function AnalyticsView(props: AnalyticsViewProps) {
	return <div className="Analytics">

		<div style={{
			width: "100%",
			padding: "4rem 0",
			display: "grid",
			placeItems: "center",
		}}>
			<Type>
				{"Analytics feature is coming here in a future version"}
			</Type>
		</div>

	</div>
}