import { DateUtils } from "../DateUtils/DateUtils";
import { CalculateAnalyticsArguments } from "./calculateAnalytics";

export function calculateAnalyticsAllTime(args: CalculateAnalyticsArguments) {
  // Record total
  const total = {
    total: 0,
    incomes: 0,
    expenses: 0,
  };

  // Record all incomes, expenses, their total sums and the
  // cumulative sums for each month
  const months: Record<
    number,
    {
      key: number;
      incomes: number;
      expenses: number;
      total: number;
      cumulativeTotal: number;
    }
  > = {};

  // Go through each transaction and count them towards their month
  args.transactions.forEach((transaction) => {
    // Get month key
    const key = DateUtils.serializeMonth(transaction.date);

    // Initialize missing months
    if (!months[key]) {
      months[key] = {
        key,
        incomes: 0,
        expenses: 0,
        total: 0,
        cumulativeTotal: 0,
      };
    }

    // Count amount values
    total.total += transaction.amount.value;
    months[key].total += transaction.amount.value;
    if (transaction.amount.value > 0) {
      total.incomes += transaction.amount.value;
      months[key].incomes += transaction.amount.value;
    }
    if (transaction.amount.value < 0) {
      total.expenses += transaction.amount.value;
      months[key].expenses += transaction.amount.value;
    }
  });

  // Calculate the cumulative sum
  let accumulator = 0;
  const sortedMonths = Object.values(months).sort((a, b) => a.key - b.key);
  for (const month of sortedMonths) {
    accumulator += month.total;
    month.cumulativeTotal += accumulator;
  }

  return { total, months };
}
