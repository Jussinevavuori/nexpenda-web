export class MoneyAmount {
  /**
   * Value of money amount as integer in cents
   */
  private _value: number;

  /**
   * Construct a money amount from an integer value in cents.
   *
   * @throws Error if input value is not an integer.
   */
  constructor(cents: number) {
    this._value = Math.trunc(cents);
  }

  /**
   * The money amount's value as an integer in cents.
   */
  get value(): number {
    return this._value;
  }

  /**
   * The money amount's value in euros.
   */
  get decimalValue(): number {
    return this._value / 100;
  }

  /**
   * Get the value in euros as an integer
   */
  get euros() {
    return Math.trunc(this._value / 100);
  }

  /**
   * Get the amount of cents in value
   *
   * Returns the remainder when converting the value to euros,
   * i.e. a value between 0 - 99, not the full value counted in cents.
   */
  get cents() {
    return Math.floor(Math.abs(this._value) % 100);
  }

  /**
   * Gets the sign of the money amount
   *
   * - Returns -1 for negative money amounts
   * - Returns 0 for zero amounts
   * - Returns +1 for positive money amounts
   */
  get sign(): -1 | 0 | 1 {
    return this._value === 0 ? 0 : this._value > 0 ? 1 : -1;
  }

  /**
   * True if the amount is a positive amount (> 0)
   */
  get isPositive() {
    return this._value > 0;
  }

  /**
   * True if the amount is a positive amount or zero (>= 0)
   */
  get isNonNegative() {
    return this._value >= 0;
  }

  /**
   * True if the amount is zero (== 0)
   */
  get isZero() {
    return this._value === 0;
  }

  /**
   * True if the amount is a negative amount or zero (<= 0)
   */
  get isNonPositive() {
    return this._value <= 0;
  }

  /**
   * True if the amount is a negative amount (< 0)
   */
  get isNegative() {
    return this._value < 0;
  }

  /**
   * Format the money amount to a string according to the given options
   */
  format(): string {
    return MoneyAmount.format(this.value);
  }

  /**
   * Static method for formatting a value
   */
  static format(value: number) {
    const sign = value < 0 ? "-" : "";
    const [euros, cents] = Math.abs(value / 100)
      .toFixed(2)
      .split(/[.,]/g);

    const eurStr = Array.from(euros)
      .map((c, i, a) => {
        const j = a.length - i - 1;
        return j > 0 && j % 3 === 0 ? c + " " : c;
      })
      .join("");

    return `${sign}${eurStr},${cents} €`;
  }

  /**
   * Static metnod for formatting large values (12 345,67 € -> 12 k)
   */
  static largeFormat(value: number) {
    let sign = value < 0 ? "-" : "";
    let scale = 1000;
    let unit = "k";
    const absvalue = Math.abs(value);
    if (absvalue > 100 * 1000 * 1000) {
      scale = 1000 * 1000;
      unit = "M";
    } else if (absvalue > 100 * 1000 * 1000 * 1000) {
      scale = 1000 * 1000 * 1000;
      unit = "B";
    }
    let scaledAmount = Math.floor(absvalue / (100 * scale));
    return `${sign}${scaledAmount} ${unit}`;
  }

  /**
   * Method to add two MoneyAmounts together to produce their sum
   * as a new MoneyAmount
   */
  add(that: MoneyAmount) {
    return new MoneyAmount(this._value + that._value);
  }

  /**
   * Method to subtract a MoneyAmount from another to produce their
   * difference as a new MoneyAmount
   */
  subtract(that: MoneyAmount) {
    return new MoneyAmount(this._value - that._value);
  }

  /**
   * Method to directly change the value of this instance
   */
  changeInternalValue() {
    return {
      add: (amount: number) => {
        if (Math.trunc(amount) !== amount) {
          throw new Error("Cannot change money amount by non-integer value");
        }
        this._value += amount;
      },
      subtract: (amount: number) => {
        if (Math.trunc(amount) !== amount) {
          throw new Error("Cannot change money amount by non-integer value");
        }
        this._value -= amount;
      },
      multiply: (amount: number) => {
        if (Math.trunc(amount) !== amount) {
          throw new Error("Cannot change money amount by non-integer value");
        }
        this._value *= amount;
      },
      set: (amount: number) => {
        if (Math.trunc(amount) !== amount) {
          throw new Error("Cannot change money amount by non-integer value");
        }
        this._value = amount;
      },
    };
  }

  /**
   * Static method to sum together multiple money amounts
   */
  static sum(values: MoneyAmount[]) {
    return values.reduce((sum, value) => sum.add(value), new MoneyAmount(0));
  }
}
