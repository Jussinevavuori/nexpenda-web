import { Category } from "../../classes/Category";
import { CalculateAnalyticsArguments } from "./calculateAnalytics";
import { v4 as uuid } from "uuid";

export function calculateAnalyticsSelected(args: CalculateAnalyticsArguments) {
  const total = {
    total: 0,
    incomes: 0,
    expenses: 0,
    transactions: 0,
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

  // Filter transactions by selected interval (empty search string)
  const transactions = args.transactions.filter((t) =>
    t.filter("", args.interval.start, args.interval.end)
  );

  transactions.forEach((transaction) => {
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

  // Calculate max income and expense categories
  categories.max.incomes = Object.values(categories.incomes).reduce(
    (max, next) => (next.total > max ? next.total : max),
    0
  );
  categories.max.expenses = Object.values(categories.expenses).reduce(
    (max, next) => (next.total < max ? next.total : max),
    0
  );

  // Calculate all percentages
  Object.values(categories.incomes).forEach((category) => {
    const max = categories.max.incomes;
    const tot = total.incomes;
    category.percentageOfMax = max === 0 ? 0 : 100 * (category.total / max);
    category.percentageOfTotal = tot === 0 ? 0 : 100 * (category.total / tot);
  });
  Object.values(categories.expenses).forEach((category) => {
    const max = categories.max.expenses;
    const tot = total.expenses;
    category.percentageOfMax = max === 0 ? 0 : 100 * (category.total / max);
    category.percentageOfTotal = tot === 0 ? 0 : 100 * (category.total / tot);
  });

  return {
    total,
    categories,
    transactions,
  };
}
