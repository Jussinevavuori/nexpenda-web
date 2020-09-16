import { JsonTransaction } from "./transactions.json";
import * as uuid from "uuid";
import { MoneyAmount } from "../../classes/MoneyAmount";

export class Transaction {
  date: Date;
  category: string;
  comment: string;
  amount: MoneyAmount;
  id: string;
  uid: string;

  constructor(json: JsonTransaction) {
    this.date = new Date(json.time);
    this.comment = json.comment || "";
    this.category = json.category;
    this.amount = new MoneyAmount(Math.floor(json.integerAmount));
    this.id = json.id || uuid.v4();
    this.uid = json.uid;
  }

  toJson(): JsonTransaction {
    return {
      time: this.date.getTime(),
      category: this.category,
      comment: this.comment,
      integerAmount: this.amount.value,
      id: this.id,
      uid: this.uid,
    };
  }
}
