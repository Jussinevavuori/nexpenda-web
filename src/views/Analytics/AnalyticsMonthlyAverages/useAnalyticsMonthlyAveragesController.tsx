import { useMemo, useState } from "react"
import { useStoreState } from "../../../store"
import { AnalyticsMonthlyAveragesProps } from "./AnalyticsMonthlyAverages"
import { subYears, startOfYear, endOfYear, differenceInMonths, subMonths, endOfMonth, startOfMonth } from "date-fns"
import { DateUtils } from "../../../utils/DateUtils/DateUtils"
import { MAXIMUM_DATE, MINIMUM_DATE } from "../../../constants"
import { MoneyAmount } from "../../../classes/MoneyAmount"


function isInTimerange(date: Date, timerange: Timerange) {
	return DateUtils.compareDate(date, ">=", timerange.start)
		&& DateUtils.compareDate(date, "<=", timerange.end);
}

function getTimerangeLengthInMonths(timerange: Timerange, earliestDate: Date, latestDate: Date) {
	const end = latestDate.getTime() < timerange.end.getTime() ? latestDate : timerange.end
	const start = earliestDate.getTime() > timerange.start.getTime() ? earliestDate : timerange.start

	const diff = differenceInMonths(end, start)

	return Math.floor(Math.max(1, 1 + Math.abs(diff)))
}

export type TimerangeID = "last12months" | "thisyear" | "lastyear" | "alltime"

export type Timerange = {
	id: TimerangeID;
	label: string;
	start: Date;
	end: Date;
}

const timeranges: Timerange[] = [
	{
		id: "last12months",
		label: "Last 12 months",
		start: startOfMonth(subMonths(new Date(), 11)),
		end: endOfMonth(new Date()),
	},
	{
		id: "thisyear",
		label: "This year",
		start: startOfYear(new Date()),
		end: endOfYear(new Date()),
	},
	{
		id: "lastyear",
		label: "Last year",
		start: startOfYear(subYears(new Date(), 1)),
		end: endOfYear(subYears(new Date(), 1)),
	},
	{
		id: "alltime",
		label: "All time",
		start: MINIMUM_DATE,
		end: MAXIMUM_DATE,
	}
]

export function useAnalyticsMonthlyAveragesController(props: AnalyticsMonthlyAveragesProps) {

	const [activeTimerangeId, setActiveTimerangeId] = useState<TimerangeID>("thisyear")

	const earliestDate = useStoreState(_ => _.transactions.earliestDate)
	const latestDate = useStoreState(_ => _.transactions.latestDate)

	const activeTimerange = useMemo(() => {
		return timeranges.find(_ => _.id === activeTimerangeId) ?? timeranges[0]
	}, [activeTimerangeId])

	const transactions = useStoreState(_ => _.transactions.items)

	const averages = useMemo(() => {

		// Set up counter object
		const temp = timeranges.reduce(
			(totals, tr) => {
				return {
					...totals,
					[tr.id]: {
						total: 0,
						income: 0,
						expense: 0,
					}
				}
			},
			{} as { [id in TimerangeID]: {
				total: number;
				income: number;
				expense: number;
			} }
		)

		// Calculate all months totals for each timerange
		transactions.forEach(transaction => {
			timeranges.forEach(timerange => {
				if (isInTimerange(transaction.date, timerange)) {
					const value = transaction.amount.value
					temp[timerange.id].total += value
					if (value > 0) {
						temp[timerange.id].income += value
					} else {
						temp[timerange.id].expense += value
					}
				}
			})
		})

		// Count averages
		timeranges.forEach(timerange => {
			const totalMonths = getTimerangeLengthInMonths(timerange, earliestDate, latestDate)

			temp[timerange.id].total /= totalMonths
			temp[timerange.id].income /= totalMonths
			temp[timerange.id].expense /= totalMonths
		})

		// Convert to money amounts
		return timeranges.reduce(
			(totals, tr) => {
				return {
					...totals,
					[tr.id]: {
						total: new MoneyAmount(temp[tr.id].total),
						income: new MoneyAmount(temp[tr.id].income),
						expense: new MoneyAmount(temp[tr.id].expense),
					}
				}
			},
			{} as { [id in TimerangeID]: {
				total: MoneyAmount;
				income: MoneyAmount;
				expense: MoneyAmount;
			} }
		)
	}, [transactions, earliestDate, latestDate])

	const activeAverage = useMemo(() => {
		return averages[activeTimerangeId]
	}, [averages, activeTimerangeId])

	return {
		averages,
		activeAverage,
		timeranges,
		setActiveTimerangeId,
		activeTimerange
	}
}