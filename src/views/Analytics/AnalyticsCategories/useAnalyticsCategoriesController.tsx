import { useState } from "react"
import { useAnalyticsContext } from "../../../contexts/AnalyticsContext.context"
import { AnalyticsCategoriesProps } from "./AnalyticsCategories"

export function useAnalyticsCategoriesController(props: AnalyticsCategoriesProps) {

	const analytics = useAnalyticsContext()

	const [isShowingPercentages, setIsShowingPercentages] = useState(false)

	const categories = analytics.selected.categories

	const incomes = Object.values(categories.incomes).sort((a, b) => {
		return b.total - a.total
	})
	const expenses = Object.values(categories.expenses).sort((a, b) => {
		return a.total - b.total
	})

	const hasNoIncomes = incomes.length === 0
	const hasNoExpenses = expenses.length === 0

	return {
		incomes,
		expenses,
		hasNoIncomes,
		hasNoExpenses,
		isShowingPercentages,
		isShowingValues: !isShowingPercentages,
		showPercentages() {
			setIsShowingPercentages(true)
		},
		showValues() {
			setIsShowingPercentages(false)
		},
	}
}