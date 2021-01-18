import * as uuid from "uuid";
import { MoneyAmount } from "./MoneyAmount";
import { object, string, number, ObjectSchema } from "yup";
import { DateUtils } from "../utils/DateUtils/DateUtils";
import { Category, DefaultCategory } from "./Category";

export type JsonTransaction = {
  id: string;
  uid: string;
  time: number;
  categoryId: string;
  integerAmount: number;
  comment?: string | undefined;
};

export type JsonTransactionInitializer = Omit<JsonTransaction, "categoryId"> & {
  category: string;
};

// Get today's date for comparison in order to avoid creating
// too many Date objects
const today = new Date();

export class Transaction {
  public date: Date;
  public category: Category;
  public comment: string;
  public amount: MoneyAmount;
  public id: string;
  public uid: string;

  constructor(json: JsonTransaction, category?: Category) {
    this.date = new Date(json.time);
    this.category = category || DefaultCategory;
    this.comment = json.comment || "";
    this.amount = new MoneyAmount(Math.floor(json.integerAmount));
    this.id = json.id || uuid.v4();
    this.uid = json.uid;
  }

  /**
   * Is the transaction upcoming, i.e. is its date in the future
   */
  get isUpcoming() {
    return DateUtils.compareDate(this.date, ">", today);
  }

  /**
   * JsonSchema defining shape of JsonTransactions for yup validation
   */
  static JsonSchema: ObjectSchema<JsonTransaction> = object({
    id: string().required(),
    uid: string().required(),
    time: number().positive().integer().required(),
    categoryId: string().required(),
    integerAmount: number().integer().required(),
    comment: string(),
  }).required();

  /**
   * JsonSchema defining shape of JsonTransactions for yup validation
   */
  static JsonInitializerSchema: ObjectSchema<JsonTransactionInitializer> = object(
    {
      id: string().required(),
      uid: string().required(),
      time: number().positive().integer().required(),
      category: string().required(),
      integerAmount: number().integer().required(),
      comment: string(),
    }
  ).required();

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
   * Is the value a valid JsonTransaction
   */
  static isJsonInitializer(arg: any): arg is JsonTransactionInitializer {
    try {
      Transaction.JsonInitializerSchema.validateSync(arg);
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
   * Is the value an array of valid JsonTransactions
   */
  static isJsonInitializerArray(arg: any): arg is JsonTransactionInitializer[] {
    return Array.isArray(arg) && arg.every(Transaction.isJsonInitializer);
  }

  /**
   * Convert Transaction to JsonTransaction
   */
  toJson(): JsonTransaction {
    return {
      time: this.date.getTime(),
      categoryId: this.category.id,
      comment: this.comment,
      integerAmount: this.amount.value,
      id: this.id,
      uid: this.uid,
    };
  }

  /**
   * Convert Transaction to JsonTransaction
   */
  toJsonInitializer(): JsonTransactionInitializer {
    return {
      time: this.date.getTime(),
      category: this.category.value,
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
        return a.category.value.localeCompare(b.category.value);
      case "category-descending":
        return b.category.value.localeCompare(a.category.value);
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
