import "./Analytics.scss";
import React from "react"
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry"
import { AnalyticsHeader } from "./AnalyticsHeader/AnalyticsHeader";
import { theme } from "../../styles/main";
import { useMdMedia } from "../../hooks/utils/useMedia";
import { AnalyticsPanel } from "./AnalyticsPanel/AnalyticsPanel";
import { AnalyticsCategories } from "./AnalyticsCategories/AnalyticsCategories";
import { AnalyticsContextProvider } from "../../contexts/AnalyticsContext.context";
import { useAnalyticsController } from "./useAnalyticsController";
import { Type } from "../../components/Type/Type";
import { AnalyticsAllTimeColumns } from "./AnalyticsAllTimeColumns/AnalyticsAllTimeColumns";
import { AnalyticsOverview } from "./AnalyticsOverview/AnalyticsOverview";
import { AnalyticsAllTimeOverview } from "../../components/AnalyticsAllTimeOverview/AnalyticsAllTimeOverview";
import { BudgetsOverview } from "../../components/BudgetsOverview/BudgetsOverview";
import { BudgetsContextProvider } from "../../contexts/BudgetsContext.context";

export type AnalyticsProps = {
}

export function Analytics(props: AnalyticsProps) {
	const controller = useAnalyticsController(props)
	const isDesktop = useMdMedia()

	return <BudgetsContextProvider>
		<AnalyticsContextProvider>

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
					<Type
						component="h2"
						variant="bold"
						size="xl"
						color="gray-900"
					>
						{`Summary of ${controller.intervalLabel}`}
					</Type>
					<ResponsiveMasonry
						className="masonry"
						columnsCountBreakPoints={{ 350: 1, 700: 2 }}
					>
						<Masonry gutter={theme.spacing_4}>
							<AnalyticsOverview />
							<AnalyticsCategories />
							<BudgetsOverview variant="narrow" />
						</Masonry>
					</ResponsiveMasonry>
					{/* <Type
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
				</ResponsiveMasonry> */}
					<Type
						component="h2"
						variant="bold"
						size="xl"
						color="gray-900"
					>
						{"All time charts"}
					</Type>
					<ResponsiveMasonry
						className="masonry"
						columnsCountBreakPoints={{ 350: 1, 700: 2 }}
					>
						<Masonry gutter={theme.spacing_4}>
							<AnalyticsAllTimeOverview />
							{/* <AnalyticsAllTimeLine /> */}
							<AnalyticsAllTimeColumns />
						</Masonry>
					</ResponsiveMasonry>
				</section>

			</div>
		</AnalyticsContextProvider>
	</BudgetsContextProvider>
}