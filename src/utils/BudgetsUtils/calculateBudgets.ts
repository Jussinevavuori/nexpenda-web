import { Budget } from "../../classes/Budget";
import { MoneyAmount } from "../../classes/MoneyAmount";
import { Transaction } from "../../classes/Transaction";
import { differenceInMonths, startOfDay, endOfDay, sub } from "date-fns";

export type CalculateBudgetsArguments = {
  transactions: Transaction[];
  budgets: Budget[];
  interval: {
    start: Date;
    end: Date;
  };
};

export function calculateBudgets(args: CalculateBudgetsArguments) {
  // Get lenght of interval in months
  const lengthInMonths =
    differenceInMonths(args.interval.end, args.interval.start) + 1;

  // Helper function to get all transactions for a budget. Returns a list
  // of all transactions that belong to the specific budget and are within
  // the interval (or extended interval if budget has a longer period that
  // is selected)
  function getTransactionsForBudget(budget: Budget) {
    // Adjust interval start if necessary such that transactions from at least
    // budget.periodMonths months are considered.
    const intervalStart = startOfDay(
      lengthInMonths < budget.periodMonths
        ? sub(args.interval.start, {
            months: budget.periodMonths - lengthInMonths,
          })
        : args.interval.start
    );

    // Get interval end as is
    const intervalEnd = endOfDay(args.interval.end);

    return args.transactions.filter((transaction) => {
      return (
        budget.includesTransaction(transaction) &&
        transaction.filter("", intervalStart, intervalEnd)
      );
    });
  }

  // Temp counter
  let _ = {
    monthly: {
      income: {
        progress: 0,
        estimate: 0,
      },
      expense: {
        progress: 0,
        estimate: 0,
      },
    },
    absolute: {
      income: {
        progress: 0,
        estimate: 0,
      },
      expense: {
        progress: 0,
        estimate: 0,
      },
    },
  };

  // Calculate progress of all budgets
  const extendedBudgets = args.budgets.map((budget) => {
    // All transactions that are counted towards the budget,
    // including transactions outside of the current range if
    // period is longer than selection.
    const budgetTransactions = getTransactionsForBudget(budget);

    // The progressed amount counted towards the budget
    const progressAmount = budgetTransactions.reduce((sum, transaction) => {
      return sum + transaction.amount.value;
    }, 0);

    // The adjusted progressed amount counted towards the total budget
    const adjustedProgressAmount = progressAmount / budget.periodMonths;

    // Value of budget
    const value = budget.amount.value * lengthInMonths;

    // Adjusted value of budget (how much the budget should be worth during
    // the specified interval).
    const adjustedValue = value / budget.periodMonths;

    // How many percentage is the progress of the budget limit?
    const progressPercentage = percentage(progressAmount, adjustedValue);
    const adjustedProgressPercentage = progressPercentage / budget.periodMonths;

    // Count progress and limit to temp variable
    if (budget.isExpense) {
      _.monthly.expense.estimate += Math.abs(adjustedValue);
      _.monthly.expense.progress += Math.abs(adjustedProgressAmount);
      _.absolute.expense.estimate += Math.abs(value);
      _.absolute.expense.progress += Math.abs(progressAmount);
    } else {
      _.monthly.income.estimate += Math.abs(adjustedValue);
      _.monthly.income.progress += Math.abs(adjustedProgressAmount);
      _.absolute.income.estimate += Math.abs(value);
      _.absolute.income.progress += Math.abs(progressAmount);
    }

    return {
      budget,
      progressAmount: {
        monthly: new MoneyAmount(adjustedProgressAmount),
        absolute: new MoneyAmount(progressAmount),
      },
      progressPercentage: {
        monthly: adjustedProgressPercentage,
        absolute: progressPercentage,
      },
    };
  });

  // Total income and expense budgets
  const budgetTotals = {
    monthly: {
      income: {
        estimate: new MoneyAmount(_.monthly.income.estimate),
        progress: new MoneyAmount(_.monthly.income.progress),
        percentage: percentage(
          _.monthly.income.progress,
          _.monthly.income.estimate
        ),
      },
      expense: {
        estimate: new MoneyAmount(_.monthly.expense.estimate),
        progress: new MoneyAmount(_.monthly.expense.progress),
        percentage: percentage(
          _.monthly.expense.progress,
          _.monthly.expense.estimate
        ),
      },
    },
    absolute: {
      income: {
        estimate: new MoneyAmount(_.absolute.income.estimate),
        progress: new MoneyAmount(_.absolute.income.progress),
        percentage: percentage(
          _.absolute.income.progress,
          _.absolute.income.estimate
        ),
      },
      expense: {
        estimate: new MoneyAmount(_.absolute.expense.estimate),
        progress: new MoneyAmount(_.absolute.expense.progress),
        percentage: percentage(
          _.absolute.expense.progress,
          _.absolute.expense.estimate
        ),
      },
    },
    monthlyTotal: {
      estimate: new MoneyAmount(
        _.monthly.income.estimate - _.monthly.expense.estimate
      ),
      progress: new MoneyAmount(
        _.monthly.income.progress - _.monthly.expense.progress
      ),
      percentage: percentage(
        _.monthly.income.progress + _.monthly.expense.progress,
        _.monthly.income.estimate + _.monthly.expense.estimate
      ),
    },
    absoluteTotal: {
      estimate: new MoneyAmount(
        _.absolute.income.estimate - _.absolute.expense.estimate
      ),
      progress: new MoneyAmount(
        _.absolute.income.progress - _.absolute.expense.progress
      ),
      percentage: percentage(
        _.absolute.income.progress + _.absolute.expense.progress,
        _.absolute.income.estimate + _.absolute.expense.estimate
      ),
    },
  };

  return {
    budgetTotals,
    extendedBudgets,
    data: {
      budgets: args.budgets,
      interval: args.interval,
      intervalLengthInMonths: lengthInMonths,
    },
  };
}

/**
 * Calculate percentage 100 * a / b or 0 of b === 0
 */
function percentage(a: number, b: number) {
  return b === 0 ? 0 : 100 * (a / b);
}
