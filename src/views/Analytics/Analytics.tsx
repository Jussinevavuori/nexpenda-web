import "./Analytics.scss";
import React from "react"
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry"
import { theme } from "../../styles/main";
import { AnalyticsCategories } from "./AnalyticsCategories/AnalyticsCategories";
import { AnalyticsContextProvider } from "../../contexts/AnalyticsContext.context";
import { useAnalyticsController } from "./useAnalyticsController";
import { Type } from "../../components/Type/Type";
import { AnalyticsAllTimeColumns } from "./AnalyticsAllTimeColumns/AnalyticsAllTimeColumns";
import { AnalyticsOverview } from "./AnalyticsOverview/AnalyticsOverview";
import { BudgetsOverview } from "../../components/BudgetsOverview/BudgetsOverview";
import { BudgetsContextProvider } from "../../contexts/BudgetsContext.context";
import { ViewHeader } from "../../components/ViewHeader/ViewHeader";
import { ViewContainer } from "../../components/ViewContainer/ViewContainer";
import { DefaultViewPanel } from "../../components/DefaultViewPanel/DefaultViewPanel";
import { useIsDarkTheme } from "../../hooks/application/useIsThemeMode";

export type AnalyticsProps = {
}

export function Analytics(props: AnalyticsProps) {
	const controller = useAnalyticsController(props)
	const isDarkTheme = useIsDarkTheme()

	return <BudgetsContextProvider>
		<AnalyticsContextProvider>
			<ViewContainer
				scrollable
				viewHeader={<ViewHeader>{"Analytics"}</ViewHeader>}
				viewPanel={<DefaultViewPanel />}
			>
				<div className="Analytics">
					<Type
						component="h2"
						variant="bold"
						size="xl"
						color={isDarkTheme ? "gray-100" : "gray-900"}
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
					<Type
						component="h2"
						variant="bold"
						size="xl"
						color={isDarkTheme ? "gray-100" : "gray-900"}
					>
						{"All time charts"}
					</Type>
					<ResponsiveMasonry
						className="masonry"
						columnsCountBreakPoints={{ 350: 1, 700: 2 }}
					>
						<Masonry gutter={theme.spacing_4}>
							<AnalyticsOverview interval="allTime" />
							<AnalyticsAllTimeColumns />
						</Masonry>
					</ResponsiveMasonry>
				</div>
			</ViewContainer>
		</AnalyticsContextProvider>
	</BudgetsContextProvider>
}