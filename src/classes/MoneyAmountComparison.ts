import { MoneyAmount } from "./MoneyAmount";
import { v4 as uuid } from "uuid";

export type MoneyAmountComparisonType = "<" | ">" | "<=" | ">=" | "=";

/**
 * Contains logic for comparing money amounts.
 */
export class MoneyAmountComparison {
  /**
   * Comparison type
   */
  comparisonType: MoneyAmountComparisonType;

  /**
   * Amount to compare to
   */
  amount: MoneyAmount;

  /**
   * ID generated at creation
   */
  id: string;

  constructor(
    comparisonType: MoneyAmountComparisonType,
    amount: number | MoneyAmount
  ) {
    this.comparisonType = comparisonType;
    this.amount = typeof amount === "number" ? new MoneyAmount(amount) : amount;
    this.id = uuid();
  }

  /**
   * Check whether the comparison matches.
   */
  compare(moneyAmount: MoneyAmount): boolean {
    switch (this.comparisonType) {
      case "<":
        return moneyAmount.value < this.amount.value;
      case ">":
        return moneyAmount.value > this.amount.value;
      case "=":
        return moneyAmount.value === this.amount.value;
      case "<=":
        return moneyAmount.value <= this.amount.value;
      case ">=":
        return moneyAmount.value >= this.amount.value;
    }
  }

  /**
   * Convert this to a string.
   */
  toString() {
    return this.comparisonType + this.amount.decimalValue.toFixed(2);
  }

  /**
   * Regex to match all valid money amount comparisons
   */
  static regex = /^(<=|>=|<|>|=)([-+]?\d*\.?\d*)$/;

  /**
   * Check if a value is a valid money amount comparison type
   */
  static isMoneyAmountComparisonType(
    arg: any
  ): arg is MoneyAmountComparisonType {
    return (
      arg === "<" || arg === ">" || arg === "=" || arg === "<=" || arg === ">="
    );
  }

  /**
   * Take in a string format and attempt to construct a money amount comparison
   * from it.
   */
  static fromString(string: string): MoneyAmountComparison | undefined {
    // Match string to regex. If no match, return undefined as a money amount
    // comparison is unable to be created from it.
    const match = string.match(MoneyAmountComparison.regex);
    if (!match) {
      return undefined;
    }

    // Get the type and value (converted to a number) from their capturing
    // groups in the regex match.
    const type = match[1];
    const value = Math.trunc(100 * Number(match[2]));

    // Validate the type as a money amount comparison type and the number as
    // a safe integer and construct a money amount comparison from them
    // if the validation passed
    if (
      MoneyAmountComparison.isMoneyAmountComparisonType(type) &&
      Number.isFinite(value) &&
      Number.isSafeInteger(value)
    ) {
      return new MoneyAmountComparison(type, value);
    }

    // Return undefined if validation fails to pass
    return undefined;
  }
}
