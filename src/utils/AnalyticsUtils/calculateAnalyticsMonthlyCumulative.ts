import { MoneyAmount } from "../../classes/MoneyAmount";
import { Transaction } from "../../classes/Transaction";

function serializeMonth(date: Date): number {
  return date.getFullYear() * 12 + date.getMonth();
}

function deserializeMonth(serial: number) {
  const year = Math.floor(serial / 12);
  const month = Math.floor(serial % 12);
  return new Date(year, month);
}

export function calculateAnalyticsMonthlyCumulative(
  transactions: Transaction[]
) {
  // Calculate total value overall
  let total = new MoneyAmount(0);

  // Calculate cumulative monhtly sum
  let cumsum = 0;

  // Set up array for x,y-data points (x: month index, y: monthly cumulative sum)
  const data: Array<{ x: Date; y: number }> = [];

  // Record all monhtly totals
  const monthTotals: Record<number, number> = {};

  // Calculate all monhtly totals and overall total
  transactions.forEach((transaction) => {
    total.changeInternalValue().add(transaction.amount.value);
    const month = serializeMonth(transaction.date);
    if (!monthTotals[month]) {
      monthTotals[month] = 0;
    }
    monthTotals[month] += transaction.amount.decimalValue;
  });

  // Calculate first and last months
  const firstMonth = Math.min(...Object.keys(monthTotals).map(Number));
  const lastMonth = Math.max(...Object.keys(monthTotals).map(Number));

  // Loop over all months in order, calculate cumulative sum and set up data points
  let currentMonth = firstMonth;
  while (currentMonth <= lastMonth) {
    const monthDate = deserializeMonth(currentMonth);
    cumsum += monthTotals[currentMonth] ?? 0;
    data.push({ x: monthDate, y: cumsum });
    currentMonth += 1;
  }

  // Return the data, the first month and the total value along with
  // utility serializer and deserializer functions
  return {
    data,
    firstMonth,
    total,
    serializeMonth,
    deserializeMonth,
  };
}
