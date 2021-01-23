import { Category } from "../../classes/Category";
import { Transaction } from "../../classes/Transaction";
import { Timerange, TimerangeID } from "./Timerange";
import { Total } from "./Total";

/**
 * Calculates a base calculation for all the selected transactions. Returns
 * an object of timeranges by their IDs, with each timerange having saturated
 * totals. The totals do not have calculated percentages, nor do the totals
 * have assigned categories.
 *
 * @param transactions All existing transactions
 * @param startDate Selected interval starting date
 * @param endDate Selected interval ending date
 * @param filterTransactions Filtering function (optional) if
 * 	only selected transactions are to be considered.
 */
export function calculateAnalyticsBase(
  transactions: Transaction[],
  startDate: Date,
  endDate: Date,
  filterTransactions: (t: Transaction) => boolean = () => true
) {
  // Calculate earliest date
  const earliestDate = new Date(
    transactions.reduce((minTs, next) => {
      const ts = next.date.getTime();
      return ts < minTs ? ts : minTs;
    }, Number.MAX_SAFE_INTEGER)
  );

  // Calculate latest date
  const latestDate = new Date(
    transactions.reduce((maxTs, next) => {
      const ts = next.date.getTime();
      return ts > maxTs ? ts : maxTs;
    }, 0)
  );

  // Set up unsaturated timeranges
  const timeranges = Timerange.createTimeranges(
    earliestDate,
    latestDate,
    startDate,
    endDate
  );

  // Count up all totals of the considered transactionss into all timeranges
  // which contain each transaction, i.e. saturate the timeranges.
  transactions.forEach((transaction) => {
    if (filterTransactions(transaction)) {
      for (const timerange of Object.values(timeranges)) {
        if (timerange.includes(transaction.date)) {
          timerange.total.count(transaction);
        }
      }
    }
  });

  // Return created and saturated timeranges
  return timeranges;
}

/**
 * Calculate all general analytics to be used in the analytics context and
 * analytics tab. Should contain almost all derived data possible, which can
 * be shown in the correct useful format in the analytics tab, extendsd
 * and further derived to extra specific data.
 *
 * @param transactions All existing transactions
 * @param startDate Selected interval starting date
 * @param endDate Selected interval ending date
 * @param filterTransactions Filtering function (optional) if
 * 	only selected transactions are to be considered.
 */
export function calculateAnalytics(
  transactions: Transaction[],
  categories: Category[],
  startDate: Date,
  endDate: Date
) {
  // Calculate the base analytics for all transactions
  // over all timeranges
  const baseAnalytics = calculateAnalyticsBase(
    transactions,
    startDate,
    endDate
  );

  // Calculate the base analytics for all transactions, per category
  // in an array. Assign categories to the timeranges and their totals.
  const categoriesAnalytics = categories.map((category) => {
    const categoryAnalytics = calculateAnalyticsBase(
      transactions,
      startDate,
      endDate,
      (t) => t.category.id === category.id
    );
    Object.values(categoryAnalytics).forEach((timerange) => {
      timerange.setCategory(category);
    });
    return categoryAnalytics;
  });

  // For each existing timerange, calculate the following:
  // - Total of that category which is the greatest in total absolute value
  // - Total of that category which is the greatest in incomes
  // - Total of that category which is the greatest in expenses
  const maxCategoriesTotalsByTimerange = {} as Record<
    TimerangeID,
    { byTotal: Total; byIncomes: Total; byExpenses: Total }
  >;
  Object.values(baseAnalytics).forEach((timerange) => {
    const categoryTimeranges = categoriesAnalytics.map((_) => _[timerange.id]);
    maxCategoriesTotalsByTimerange[timerange.id] =
      categoryTimeranges.length === 0
        ? {
            byTotal: new Total(),
            byIncomes: new Total(),
            byExpenses: new Total(),
          }
        : {
            byTotal: categoryTimeranges.reduce((max, next) => {
              return Math.abs(max.total.value) >
                Math.abs(next.total.total.value)
                ? max
                : next.total;
            }, categoryTimeranges[0].total),
            byIncomes: categoryTimeranges.reduce((max, next) => {
              return max.incomes.value > next.total.incomes.value
                ? max
                : next.total;
            }, categoryTimeranges[0].total),
            byExpenses: categoryTimeranges.reduce((max, next) => {
              return max.expenses.value < next.total.expenses.value
                ? max
                : next.total;
            }, categoryTimeranges[0].total),
          };
  });

  // Using the previously calculated maximums and the base analytics
  // totals for all timeranges, calculate the percentages for all
  // category timerange totals.
  categoriesAnalytics.forEach((categoryTimeranges) => {
    Object.values(categoryTimeranges).forEach((timerange) => {
      timerange.total.calculatePercentages(
        baseAnalytics[timerange.id].total,
        maxCategoriesTotalsByTimerange[timerange.id].byTotal,
        maxCategoriesTotalsByTimerange[timerange.id].byIncomes,
        maxCategoriesTotalsByTimerange[timerange.id].byExpenses
      );
    });
  });

  // Return the base and category specific analytics.
  return {
    base: baseAnalytics,
    categories: categoriesAnalytics,
  };
}
