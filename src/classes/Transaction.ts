import * as uuid from "uuid";
import { MoneyAmount } from "./MoneyAmount";
import { object, string, number, ObjectSchema } from "yup";

export type JsonTransaction = {
  id: string;
  uid: string;
  time: number;
  category: string;
  integerAmount: number;
  comment?: string | undefined;
};

export class Transaction {
  public date: Date;
  public category: string;
  public comment: string;
  public amount: MoneyAmount;
  public id: string;
  public uid: string;

  constructor(json: JsonTransaction) {
    this.date = new Date(json.time);
    this.comment = json.comment || "";
    this.category = json.category;
    this.amount = new MoneyAmount(Math.floor(json.integerAmount));
    this.id = json.id || uuid.v4();
    this.uid = json.uid;
  }

  /**
   * JsonSchema defining shape of JsonTransactions for yup validation
   */
  static JsonSchema: ObjectSchema<JsonTransaction> = object({
    id: string().required(),
    uid: string().required(),
    time: number().positive().integer().required(),
    category: string().min(1).required(),
    integerAmount: number().integer().required(),
    comment: string(),
  }).required();

  /**
   * Is the value a valid JsonTransaction
   */
  static isJson(arg: any): arg is JsonTransaction {
    try {
      Transaction.JsonSchema.validateSync(arg);
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Is the value an array of valid JsonTransactions
   */
  static isJsonArray(arg: any): arg is JsonTransaction[] {
    return Array.isArray(arg) && arg.every(Transaction.isJson);
  }

  /**
   * Convert Transaction to JsonTransaction
   */
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

  /**
   * Comparison function for sorting transactions
   */
  static compare(
    a: Transaction,
    b: Transaction,
    strategy: TransactionSortStrategy
  ) {
    switch (strategy) {
      case "amount-ascending":
        return a.amount.value - b.amount.value;
      case "amount-descending":
        return b.amount.value - a.amount.value;
      case "category-ascending":
        return a.category.localeCompare(b.category);
      case "category-descending":
        return b.category.localeCompare(a.category);
      case "comment-ascending":
        return a.comment.localeCompare(b.comment);
      case "comment-descending":
        return b.comment.localeCompare(a.comment);
      case "date-ascending":
        return a.date.getTime() - b.date.getTime();
      case "date-descending":
        return b.date.getTime() - a.date.getTime();
      default:
        return 0;
    }
  }
}
