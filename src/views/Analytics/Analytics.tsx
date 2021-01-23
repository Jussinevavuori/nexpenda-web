import "./Analytics.scss";
import React from "react"
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry"
import { AnalyticsHeader } from "./AnalyticsHeader/AnalyticsHeader";
import { theme } from "../../styles/main";
import { useMdMedia } from "../../hooks/useMedia";
import { AnalyticsPanel } from "./AnalyticsPanel/AnalyticsPanel";
import { AnalyticsTotals } from "./AnalyticsTotals/AnalyticsTotals";
import { AnalyticsCategories } from "./AnalyticsCategories/AnalyticsCategories";
import { AnalyticsAllTimeLine } from "./AnalyticsAllTimeLine/AnalyticsAllTimeLine";
import { AnalyticsMonthlyAverages } from "./AnalyticsMonthlyAverages/AnalyticsMonthlyAverages";
import { AnalyticsContextProvider } from "../../contexts/AnalyticsContext.context";
// import { useAnalyticsController } from "./useAnalyticsController";

export type AnalyticsProps = {
	wrapInAnalyticsBlock?: boolean;
}

export function Analytics(props: AnalyticsProps) {

	// const controller = useAnalyticsController(props)

	const isDesktop = useMdMedia()

	return <AnalyticsContextProvider>
		<div className="Analytics">

			<section className="headerContainer" >
				<AnalyticsHeader />
				{
					isDesktop ? null : <div className="panelContainer">
						<AnalyticsPanel />
					</div>
				}
			</section>


			<section className="analyticsBlocksContainer">
				<AnalyticsAllTimeLine wrapInAnalyticsBlock />
				<ResponsiveMasonry columnsCountBreakPoints={{ 350: 1, 600: 2 }}>
					<Masonry gutter={theme.spacing_4}>
						<AnalyticsTotals wrapInAnalyticsBlock />
						<AnalyticsCategories wrapInAnalyticsBlock />
						<AnalyticsMonthlyAverages wrapInAnalyticsBlock />
					</Masonry>
				</ResponsiveMasonry>
			</section>

		</div>
	</AnalyticsContextProvider>
}