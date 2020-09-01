export class MoneyAmount {
  integer: number;

  constructor(integer: number) {
    if (Math.floor(integer) !== integer) {
      throw new Error("Cannot construct money amount from non-integer value");
    }
    this.integer = integer;
  }

  get decimal() {
    return this.integer / 100;
  }

  get unsignedDecimal() {
    return Math.abs(this.decimal);
  }

  get unsignedInteger() {
    return Math.abs(this.integer);
  }

  get euros() {
    if (this.integer > 0) {
      return Math.floor(this.integer / 100);
    } else {
      return Math.ceil(this.integer / 100);
    }
  }

  get formatEuros() {
    return Math.abs(this.euros).toFixed(0);
  }
  get cents() {
    return Math.floor(this.integer % 100);
  }
  get formatCents() {
    return Math.abs(this.cents).toFixed(0).padStart(2, "0");
  }
  get sign(): -1 | 0 | 1 {
    return this.integer === 0 ? 0 : this.integer > 0 ? 1 : -1;
  }
  get formatSign() {
    return this.integer === 0 ? "±" : this.integer > 0 ? "+" : "-";
  }
  get formatFull() {
    return this.formatSign + this.formatEuros + "." + this.formatCents;
  }

  get isPositive() {
    return this.sign >= 0;
  }

  get isNegative() {
    return this.sign < 0;
  }
}
