import { useMemo } from "react"
import { MoneyAmount } from "../../../classes/MoneyAmount"
import { useStoreState } from "../../../store"
import { AnalyticsTotalsProps } from "./AnalyticsTotals"

export function useAnalyticsTotalsController(props: AnalyticsTotalsProps) {
	const transactions = useStoreState(_ => _.transactions.selected.items)

	const totals = useMemo(() => {
		let totalIncomes = 0
		let totalExpenses = 0
		transactions.forEach((transaction) => {
			const value = transaction.amount.value
			if (value > 0) {
				totalIncomes += value
			} else {
				totalExpenses += value
			}
		})
		return {
			all: new MoneyAmount(totalIncomes + totalExpenses),
			incomes: new MoneyAmount(totalIncomes),
			expenses: new MoneyAmount(totalExpenses),
		}
	}, [transactions])

	return {
		transactions,
		totals
	}

}