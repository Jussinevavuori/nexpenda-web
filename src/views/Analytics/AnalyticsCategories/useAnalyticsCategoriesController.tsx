import { useAnalyticsContext } from "../../../contexts/AnalyticsContext.context"
import { AnalyticsCategoriesProps } from "./AnalyticsCategories"

export function useAnalyticsCategoriesController(props: AnalyticsCategoriesProps) {

	const analytics = useAnalyticsContext()

	return {
		incomesCategories: analytics.categories.map(_ => _["active"])
			.filter(_ => _.total.incomes.value !== 0)
			.sort((a, b) => b.total.incomes.value - a.total.incomes.value),
		expensesCategories: analytics.categories.map(_ => _["active"])
			.filter(_ => _.total.expenses.value !== 0)
			.sort((a, b) => a.total.expenses.value - b.total.expenses.value),
	}
}