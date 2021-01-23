import { Category } from "../../classes/Category";
import { MoneyAmount } from "../../classes/MoneyAmount";
import { Transaction } from "../../classes/Transaction";

export class Total {
  public total: MoneyAmount;
  public incomes: MoneyAmount;
  public expenses: MoneyAmount;

  public totalCount: number;
  public incomesCount: number;
  public expensesCount: number;

  public percentage: {
    total: {
      ofMax: number;
      ofTotal: number;
    };
    incomes: {
      ofMax: number;
      ofTotal: number;
    };
    expenses: {
      ofMax: number;
      ofTotal: number;
    };
  };
  public category?: Category;

  constructor() {
    this.total = new MoneyAmount(0);
    this.incomes = new MoneyAmount(0);
    this.expenses = new MoneyAmount(0);
    this.totalCount = 0;
    this.incomesCount = 0;
    this.expensesCount = 0;
    this.percentage = {
      total: { ofMax: 0, ofTotal: 0 },
      incomes: { ofMax: 0, ofTotal: 0 },
      expenses: { ofMax: 0, ofTotal: 0 },
    };
  }

  count(transaction: Transaction) {
    this.total.changeInternalValue().add(transaction.amount.value);
    this.totalCount++;
    if (transaction.amount.isPositive) {
      this.incomes.changeInternalValue().add(transaction.amount.value);
      this.incomesCount++;
    } else {
      this.expenses.changeInternalValue().add(transaction.amount.value);
      this.expensesCount++;
    }
  }

  getAverageTotalOver(n: number) {
    const averageTotal = new Total();
    const avg = (m: number) => (n === 0 ? 0 : m / n);
    averageTotal.total = new MoneyAmount(avg(this.total.value));
    averageTotal.incomes = new MoneyAmount(avg(this.incomes.value));
    averageTotal.expenses = new MoneyAmount(avg(this.expenses.value));
    averageTotal.totalCount = this.totalCount;
    averageTotal.incomesCount = this.incomesCount;
    averageTotal.expensesCount = this.expensesCount;
    return averageTotal;
  }

  setCategory(category: Category) {
    this.category = category;
  }

  calculatePercentages(
    total: Total,
    maxTotal: Total,
    maxIncomes: Total,
    maxExpenses: Total
  ) {
    function calc(a: MoneyAmount, b: MoneyAmount) {
      return b.value === 0 ? 0 : Math.abs((100 * a.value) / b.value);
    }
    this.percentage.total.ofMax = calc(this.total, maxTotal.total);
    this.percentage.total.ofTotal = calc(this.total, total.total);
    this.percentage.incomes.ofMax = calc(this.incomes, maxIncomes.incomes);
    this.percentage.incomes.ofTotal = calc(this.incomes, total.incomes);
    this.percentage.expenses.ofMax = calc(this.expenses, maxExpenses.expenses);
    this.percentage.expenses.ofTotal = calc(this.expenses, total.expenses);
  }
}
