import "./Analytics.scss";
import React from "react"
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry"
import { AnalyticsHeader } from "./AnalyticsHeader/AnalyticsHeader";
import { theme } from "../../styles/main";
import { useMdMedia } from "../../hooks/utils/useMedia";
import { AnalyticsPanel } from "./AnalyticsPanel/AnalyticsPanel";
import { AnalyticsTotals } from "./AnalyticsTotals/AnalyticsTotals";
import { AnalyticsCategories } from "./AnalyticsCategories/AnalyticsCategories";
import { AnalyticsAllTimeLine } from "./AnalyticsAllTimeLine/AnalyticsAllTimeLine";
import { AnalyticsContextProvider } from "../../contexts/AnalyticsContext.context";
import { useAnalyticsController } from "./useAnalyticsController";
import { Type } from "../../components/Type/Type";
import { AnalyticsAllTimeColumns } from "./AnalyticsAllTimeColumns/AnalyticsAllTimeColumns";
import { AnalyticsAverageCategories } from "./AnalyticsAverageCategories/AnalyticsAverageCategories";
import { AnalyticsAverageTotals } from "./AnalyticsAverageTotals/AnalyticsAverageTotals";
import { AnalyticsOverview } from "./AnalyticsOverview/AnalyticsOverview";

export type AnalyticsProps = {
}

export function Analytics(props: AnalyticsProps) {
	const controller = useAnalyticsController(props)
	const isDesktop = useMdMedia()

	return <AnalyticsContextProvider>
		<div className="Analytics">

			<section className="headerContainer" >
				<AnalyticsHeader />
				{
					!isDesktop && <div className="panelContainer">
						<AnalyticsPanel />
					</div>
				}
			</section>


			<section className="analyticsBlocksContainer">
				{
					process.env.NODE_ENV === "development" &&
					<AnalyticsOverview />
				}
				<AnalyticsAllTimeLine />
				<AnalyticsAllTimeColumns />
				<Type
					component="h2"
					variant="bold"
					size="xl"
					color="gray-900"
				>
					{controller.intervalLabel}
				</Type>
				<ResponsiveMasonry
					columnsCountBreakPoints={{ 350: 1, 700: 2 }}
				>
					<Masonry gutter={theme.spacing_4}>
						<AnalyticsTotals />
						<AnalyticsCategories />
					</Masonry>
				</ResponsiveMasonry>
				<Type
					component="h2"
					variant="bold"
					size="xl"
					color="gray-900"
				>
					{"Past year habits"}
				</Type>
				<ResponsiveMasonry
					columnsCountBreakPoints={{ 350: 1, 700: 2 }}
				>
					<Masonry gutter={theme.spacing_4}>
						<AnalyticsAverageTotals />
						<AnalyticsAverageCategories showOnly="incomes" />
						<AnalyticsAverageCategories showOnly="expenses" />
					</Masonry>
				</ResponsiveMasonry>
			</section>

		</div>
	</AnalyticsContextProvider>
}