import { Budget } from "../../classes/Budget";
import { MoneyAmount } from "../../classes/MoneyAmount";
import { Transaction } from "../../classes/Transaction";

export type CalculateBudgetsArguments = {
  transactions: Transaction[];
  budgets: Budget[];
  interval: {
    start: Date;
    end: Date;
  };
};

export function calculateBudgets(args: CalculateBudgetsArguments) {
  // Filter transactions by interval
  const transactions = args.transactions.filter((transaction) => {
    return transaction.filter("", args.interval.start, args.interval.end);
  });

  // Temp counter
  let _total = {
    incomeProgress: 0,
    incomeEstimate: 0,
    expenseProgress: 0,
    expenseEstimate: 0,
  };

  // Calculate progress of all budgets
  const extendedBudgets = args.budgets.map((budget) => {
    // All transactions that are counted towards the budget
    const budgetTransactions = transactions.filter((_) => {
      return budget.includesTransaction(_);
    });

    // The progressed amount counted towards the budget
    const progressAmount = new MoneyAmount(
      budgetTransactions.reduce((sum, transaction) => {
        return sum + transaction.amount.value;
      }, 0)
    );

    // How many percentage is the progress of the budget limit?
    const progressPercentage =
      budget.amount.value === 0
        ? 0
        : (100 * progressAmount.value) / budget.amount.value;

    // Count progress and limit to temp variable
    if (budget.isExpense) {
      _total.expenseEstimate += Math.abs(budget.amount.value);
      _total.expenseProgress += Math.abs(progressAmount.value);
    } else {
      _total.incomeEstimate += Math.abs(budget.amount.value);
      _total.incomeProgress += Math.abs(progressAmount.value);
    }

    return {
      budget,
      progressAmount,
      progressPercentage,
    };
  });

  // Total income and expense budgets
  const budgetTotals = {
    income: {
      estimate: new MoneyAmount(_total.incomeEstimate),
      progress: new MoneyAmount(_total.incomeEstimate),
      percentage:
        _total.incomeEstimate === 0
          ? 0
          : (100 * _total.incomeProgress) / _total.incomeEstimate,
    },
    expense: {
      estimate: new MoneyAmount(_total.expenseEstimate),
      progress: new MoneyAmount(_total.expenseProgress),
      percentage:
        _total.expenseEstimate === 0
          ? 0
          : (100 * _total.expenseProgress) / _total.expenseEstimate,
    },
  };

  return {
    budgetTotals,
    extendedBudgets,
    data: {
      budgets: args.budgets,
      transactions,
      interval: args.interval,
    },
  };
}
