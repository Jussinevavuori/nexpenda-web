import { JsonTransaction } from "./transactions.json";
import * as uuid from "uuid";

export class Transaction {
  date: Date;
  category: string;
  comment: string;
  integerAmount: number;
  id: string;

  constructor(json: JsonTransaction) {
    this.date = new Date(json.time);
    this.comment = json.comment || "";
    this.category = json.category;
    this.integerAmount = Math.floor(json.integerAmount);
    this.id = json.id || uuid.v4();
  }

  get amount() {
    return this.integerAmount / 100;
  }

  get unsignedIntegerAmount() {
    return Math.abs(this.integerAmount);
  }

  get unsignedAmount() {
    return Math.abs(this.amount);
  }

  get euros() {
    if (this.integerAmount > 0) {
      return Math.floor(this.integerAmount / 100);
    } else {
      return Math.ceil(this.integerAmount / 100);
    }
  }

  get formatEuros() {
    return Math.abs(this.euros).toFixed(0);
  }

  get cents() {
    return Math.floor(this.integerAmount % 100);
  }

  get formatCents() {
    return Math.abs(this.cents).toFixed(0).padStart(2, "0");
  }

  get sign(): -1 | 0 | 1 {
    return this.integerAmount === 0 ? 0 : this.integerAmount > 0 ? 1 : -1;
  }

  get formatSign() {
    return this.integerAmount === 0 ? "±" : this.integerAmount > 0 ? "+" : "-";
  }

  get formatFull() {
    return this.formatSign + this.formatEuros + "." + this.formatCents;
  }
}
