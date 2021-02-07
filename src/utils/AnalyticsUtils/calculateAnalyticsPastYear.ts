import { Category } from "../../classes/Category";
import { CalculateAnalyticsArguments } from "./calculateAnalytics";
import {
  subMonths,
  startOfMonth,
  endOfMonth,
  differenceInMonths,
  isAfter,
} from "date-fns";
import { v4 as uuid } from "uuid";

export function calculateAnalyticsPastYear(args: CalculateAnalyticsArguments) {
  // Get the earliest month possible and use this as a starting date
  // if transactions do not exist over 12 months ago
  const earliest = startOfMonth(
    args.transactions.reduce((min, next) => {
      return next.date.getTime() < min.getTime() ? next.date : min;
    }, new Date())
  );

  // Get date for month 12 months ago
  const yearAgo = startOfMonth(subMonths(new Date(), 11));

  // Starting month is a year ago or on earliest transaction date
  // if earliest transaction date is within 12 months
  const startingMonth = isAfter(earliest, yearAgo) ? earliest : yearAgo;
  const endingMonth = endOfMonth(new Date());

  // Get number of months
  const monthsCount = 1 + differenceInMonths(endingMonth, startingMonth);

  const total = {
    total: 0,
    average: 0,
    incomes: 0,
    incomesAverage: 0,
    expenses: 0,
    expensesAverage: 0,
    transactions: 0,
    transactionsAverage: 0,
  };

  const categories: {
    max: {
      incomes: number;
      expenses: number;
    };
    incomes: Record<
      string,
      {
        id: string;
        category: Category;
        total: number;
        average: number;
        transactions: number;
        percentageOfTotal: number;
        percentageOfMax: number;
      }
    >;
    expenses: Record<
      string,
      {
        id: string;
        category: Category;
        total: number;
        average: number;
        transactions: number;
        percentageOfTotal: number;
        percentageOfMax: number;
      }
    >;
  } = {
    max: {
      incomes: 0,
      expenses: 0,
    },
    incomes: {},
    expenses: {},
  };

  args.transactions
    .filter((transaction) => {
      return transaction.filter("", startingMonth, endingMonth);
    })
    .forEach((transaction) => {
      // Count transaction and its total
      total.total += transaction.amount.value;
      total.transactions += 1;

      // Count income and income category
      if (transaction.amount.value > 0) {
        total.incomes += transaction.amount.value;

        // Initialize income category if it doesn't yet exist
        if (!categories.incomes[transaction.category.id]) {
          categories.incomes[transaction.category.id] = {
            id: uuid(),
            category: transaction.category,
            total: 0,
            average: 0,
            transactions: 0,
            percentageOfTotal: 0,
            percentageOfMax: 0,
          };
        }

        // Count towards category
        const category = categories.incomes[transaction.category.id];
        category.total += transaction.amount.value;
        category.transactions += 1;
      }

      // Count expense and expense category
      if (transaction.amount.value < 0) {
        total.expenses += transaction.amount.value;

        // Initialize expense category if it doesn't yet exist
        if (!categories.expenses[transaction.category.id]) {
          categories.expenses[transaction.category.id] = {
            id: uuid(),
            category: transaction.category,
            total: 0,
            average: 0,
            transactions: 0,
            percentageOfTotal: 0,
            percentageOfMax: 0,
          };
        }

        // Count towards category
        const category = categories.expenses[transaction.category.id];
        category.total += transaction.amount.value;
        category.transactions += 1;
      }
    });

  // Utility average function
  const avg = (num: number) => num / (monthsCount || 1);

  // Calculate averages
  total.average = avg(total.total);
  total.incomesAverage = avg(total.incomes);
  total.expensesAverage = avg(total.expenses);
  total.transactionsAverage = avg(total.transactions);
  Object.values(categories.incomes).forEach((category) => {
    category.average = avg(category.total);
  });
  Object.values(categories.expenses).forEach((category) => {
    category.average = avg(category.total);
  });

  // Calculate max income and expense category averages
  categories.max.incomes = Object.values(categories.incomes).reduce(
    (max, next) => (next.average > max ? next.average : max),
    0
  );
  categories.max.expenses = Object.values(categories.expenses).reduce(
    (max, next) => (next.average < max ? next.average : max),
    0
  );

  // Calculate all percentages (in averages, not totals)
  Object.values(categories.incomes).forEach((category) => {
    const max = categories.max.incomes;
    const tot = total.incomesAverage;
    category.percentageOfMax = max === 0 ? 0 : 100 * (category.average / max);
    category.percentageOfTotal = tot === 0 ? 0 : 100 * (category.average / tot);
  });
  Object.values(categories.expenses).forEach((category) => {
    const max = categories.max.expenses;
    const tot = total.expensesAverage;
    category.percentageOfMax = max === 0 ? 0 : 100 * (category.average / max);
    category.percentageOfTotal = tot === 0 ? 0 : 100 * (category.average / tot);
  });

  return {
    total,
    categories,
    monthsCount,
    startingMonth,
    endingMonth,
  };
}
