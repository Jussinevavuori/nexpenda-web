import { useMemo } from "react";
import { MoneyAmount } from "../../../classes/MoneyAmount";
import { useStoreState } from "../../../store"
import { AnalyticsAllTimeLineProps } from "./AnalyticsAllTimeLine"

export function useAnalyticsAllTimeLineController(props: AnalyticsAllTimeLineProps) {

	const transactions = useStoreState(_ => _.transactions.items)

	const [data, labelOffset, total]:
		[Array<{ x: Date, y: number }>, number, MoneyAmount]
		= useMemo(() => {

			let total = new MoneyAmount(0)

			let cumsum = 0;

			const data: Array<{ x: Date, y: number }> = []

			const monthTotals: Record<number, number> = {}

			transactions.forEach(transaction => {
				total.changeInternalValue().add(transaction.amount.value)
				const month = serializeMonth(transaction.date)
				if (!monthTotals[month]) {
					monthTotals[month] = 0
				}
				monthTotals[month] += transaction.amount.decimalValue
			})

			console.log(monthTotals)

			const firstMonth = Math.min(...Object.keys(monthTotals).map(Number))
			const lastMonth = Math.max(...Object.keys(monthTotals).map(Number))

			let currentMonth = firstMonth

			while (currentMonth <= lastMonth) {
				const monthDate = deserializeMonth(currentMonth)
				cumsum += monthTotals[currentMonth] ?? 0
				data.push({ x: monthDate, y: cumsum })
				currentMonth += 1
			}

			return [data, firstMonth, total]
		}, [transactions])

	return { data, labelOffset, total, serializeMonth, deserializeMonth }
}

function serializeMonth(date: Date): number {
	return date.getFullYear() * 12 + date.getMonth()
}

function deserializeMonth(serial: number) {
	const year = Math.floor(serial / 12)
	const month = Math.floor(serial % 12)
	return new Date(year, month)
}