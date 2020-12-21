import { useMemo } from "react"
import { MoneyAmount } from "../../../classes/MoneyAmount"
import { useStoreState } from "../../../store"
import { AnalyticsCategoriesProps } from "./AnalyticsCategories"

export type CategoryAnalytics = {

	/**
	 * Category name
	 */
	category: string;

	/**
	 * Count of items in category
	 */
	count: number;

	/**
	 * Total summed amount of all items in category
	 */
	amount: MoneyAmount;

	/**
	 * Percentage of total incomes / expenses represented by category
	 */
	percentageOfTotal: number;

	/**
	 * How many percentages is this category's amount of the summed
	 * amount of the category with the highest summed amount.
	 */
	percentageOfMax: number;
}

export function useAnalyticsCategoriesController(props: AnalyticsCategoriesProps) {

	const transactions = useStoreState(_ => _.transactions.selected.items)

	const categories = useMemo(() => {

		const incomesRecord: Record<string, CategoryAnalytics> = {}
		const expensesRecord: Record<string, CategoryAnalytics> = {}

		// Calculate all existing income and expense categories and their
		// total amounts and counts
		transactions.forEach(transaction => {

			// Based on whether currently looking at an income or expense,
			// change the target object
			const target = transaction.amount.isNonNegative
				? incomesRecord
				: expensesRecord

			// If new category, create entry to target
			if (!target[transaction.category]) {
				target[transaction.category] = {
					category: transaction.category,
					count: 0,
					amount: new MoneyAmount(0),
					percentageOfTotal: 0,
					percentageOfMax: 0,
				}
			}

			// Get and modify entry by counting the value
			const entry = target[transaction.category]
			entry.count += 1
			entry.amount.changeInternalValue().add(transaction.amount.value)
		})

		// Make incomes and expenses into arrays
		const incomes = Object.values(incomesRecord)
		const expenses = Object.values(expensesRecord)

		// Set up object to count stats into
		const stats = {
			incomes: {
				maxValue: 0,
				totalValue: 0,
			},
			expenses: {
				maxValue: 0,
				totalValue: 0,
			}
		}

		// Count incomes total and max value
		incomes.forEach(category => {
			const value = category.amount.value
			stats.incomes.totalValue += value;
			if (value > stats.incomes.maxValue) {
				stats.incomes.maxValue = value
			}
		})

		// Count expenses total and max value
		expenses.forEach(category => {
			const value = category.amount.value
			stats.expenses.totalValue += value;
			if (value < stats.expenses.maxValue) {
				stats.expenses.maxValue = value
			}
		})

		// Calcluate percentages of total and of max for incomes
		incomes.forEach(category => {
			const value = category.amount.value
			category.percentageOfTotal = 100 * (value / stats.incomes.totalValue)
			category.percentageOfMax = 100 * (value / stats.incomes.maxValue)
		})

		// Calcluate percentages of total and of max for expenses
		expenses.forEach(category => {
			const value = category.amount.value
			category.percentageOfTotal = 100 * (value / stats.expenses.totalValue)
			category.percentageOfMax = 100 * (value / stats.expenses.maxValue)
		})

		// Return as sorted by amount
		return {
			incomes: incomes.sort((a, b) => b.amount.value - a.amount.value),
			expenses: expenses.sort((a, b) => a.amount.value - b.amount.value)
		}

	}, [transactions])

	return {
		transactions,
		categories
	}

}