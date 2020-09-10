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
    if (Math.trunc(cents) !== cents) {
      throw new Error("Cannot construct money amount from non-integer value");
    }
    this._value = cents;
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
  format(options?: Partial<MoneyAmountFormatOptions>): string {
    const o = { ...defaultMoneyAmountFormatOptions, ...options };

    let s = "";

    switch (o.sign) {
      case "always":
        if (this.isPositive) s += "+";
        if (this.isNegative) s += "-";
        break;
      case "if-positive":
        if (this.isPositive) s += "+";
        break;
      case "if-negative":
        if (this.isNegative) s += "-";
        break;
      default:
        break;
    }

    switch (o.spaces) {
      case "always":
        s += " ";
        break;
      case "after-sign":
        s += " ";
        break;
    }

    switch (o.thousandSpaces) {
      case "always":
        s += Math.abs(this.euros)
          .toFixed(0)
          .split("")
          .reverse()
          .map((char, i) => (i % 3 === 2 ? " " + char : char))
          .reverse()
          .join("");
        break;
      case "omit":
        s += Math.abs(this.euros).toFixed(0);
        break;
    }

    switch (o.separator) {
      case ",":
        s += ",";
        break;
      case ".":
        s += ".";
        break;
    }

    switch (true) {
      case true:
        s += this.cents.toFixed(0);
    }

    switch (o.spaces) {
      case "always":
        s += " ";
        break;
      case "before-unit":
        s += " ";
        break;
    }

    switch (o.unit) {
      case "long":
        s += "EUR";
        break;
      case "symbol":
        s += "€";
        break;
    }

    return s.trim();
  }

  add(that: MoneyAmount) {
    return new MoneyAmount(this._value + that._value);
  }

  subtract(that: MoneyAmount) {
    return new MoneyAmount(this._value - that._value);
  }

  static sum(values: MoneyAmount[]) {
    return values.reduce((sum, value) => sum.add(value), new MoneyAmount(0));
  }
}

/**
 * Options for formatting a string
 */
export type MoneyAmountFormatOptions = {
  /**
   * Option for formatting the sign
   *
   * | value         | positive example | negative example | zero example |
   * |---------------|------------------|------------------|--------------|
   * | `omit`        | `123,45 €`       | `123,45 €`       | `0,00 €`     |
   * | `if-negative` | `123,45 €`       | `- 123,45 €`     | `0,00 €`     |
   * | `if-positive` | `+ 123,45 €`     | `123,45 €`       | `0,00 €`     |
   * | `always`      | `+ 123,45 €`     | `- 123,45 €`     | `0,00 €`     |
   *
   * A zero amount will never be given a sign
   *
   * Defaults to `always`
   */
  sign: "omit" | "if-negative" | "if-positive" | "always";

  /**
   * Option for spacing between the sign, numeric value and the unit.
   *
   * | value         | example      |
   * |---------------|--------------|
   * | `omit`        | `+123,45€`   |
   * | `after-sign`  | `+ 123,45€`  |
   * | `before-unit` | `+123,45 €`  |
   * | `always`      | `+ 123,45 €` |
   *
   * If unit or sign is omitted, no space will be inserted.
   *
   * Defaults to `always`
   */
  spaces: "omit" | "always" | "after-sign" | "before-unit";

  /**
   * Option for formatting the thousands separation
   *
   * | value         | example             |
   * |---------------|---------------------|
   * | `omit`        | `+ 12345678,00 €`   |
   * | `always`      | `+ 12 345 678,00 €` |
   *
   * Defaults to `always`
   */
  thousandSpaces: "omit" | "always";

  /**
   * Option for the decimal separator
   *
   * | value | example      |
   * |-------|--------------|
   * | `,`   | `+ 123,45 €` |
   * | `.`   | `+ 123.45 €` |
   *
   * Defaults to `.`
   */
  separator: "," | ".";

  /**
   * Option for the unit
   *
   * | value    | example (with euros) |
   * |----------|----------------------|
   * | `omit`   | "- 123,45"           |
   * | `long`   | "- 123,45 EUR"       |
   * | `symbol` | "- 123,45 €"         |
   *
   * Defaults to `symbol`
   */
  unit: "omit" | "long" | "symbol";
};

/**
 * Default options for formatting a string
 */
export const defaultMoneyAmountFormatOptions: MoneyAmountFormatOptions = {
  sign: "always",
  spaces: "always",
  thousandSpaces: "always",
  separator: ".",
  unit: "symbol",
};
