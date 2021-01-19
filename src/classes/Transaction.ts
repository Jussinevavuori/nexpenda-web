import * as uuid from "uuid";
import { MoneyAmount } from "./MoneyAmount";
import { object, string, number, ObjectSchema } from "yup";
import { DateUtils } from "../utils/DateUtils/DateUtils";
import { Category, DefaultCategory } from "./Category";

export type JsonTransaction = {
  id: string;
  time: number;
  integerAmount: number;
  comment?: string | undefined;
  category: {
    id: string;
    value: string;
    incomeIcon: string;
    expenseIcon: string;
  };
};

export type JsonTransactionInitializer = Omit<JsonTransaction, "category"> & {
  category: string;
};

export type CompressedJsonTransaction = {
  id: string; // ID
  t: number; // Time (epoch)
  cid: string; // Category ID
  a: number; // Amount
  c?: string | undefined; // Comment
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

  constructor(
    json: Omit<JsonTransaction, "category"> & {
      category?: JsonTransaction["category"];
    },
    category: Category
  ) {
    this.date = new Date(json.time);
    this.category = category || DefaultCategory;
    this.comment = json.comment || "";
    this.amount = new MoneyAmount(Math.floor(json.integerAmount));
    this.id = json.id || uuid.v4();
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
    time: number().positive().integer().required(),
    integerAmount: number().integer().required(),
    comment: string(),
    category: object({
      id: string().required(),
      value: string().required(),
      incomeIcon: string().required(),
      expenseIcon: string().required(),
    }).required(),
  }).required();

  /**
   * JsonSchema defining shape of initializer JsonTransactions for yup validation
   */
  static JsonInitializerSchema: ObjectSchema<JsonTransactionInitializer> = object(
    {
      id: string().required(),
      time: number().positive().integer().required(),
      category: string().required(),
      integerAmount: number().integer().required(),
      comment: string(),
    }
  ).required();

  /**
   * JsonSchema defining shape of Compressed JsonTransactions for yup validation
   */
  static CompressedJsonSchema: ObjectSchema<CompressedJsonTransaction> = object(
    {
      id: string().required(),
      t: number().positive().integer().required(),
      cid: string().required(),
      a: number().integer().required(),
      c: string(),
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

  static isCompressedJson(arg: any): arg is CompressedJsonTransaction {
    try {
      Transaction.CompressedJsonSchema.validateSync(arg);
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
   * Is the value an array of valid JsonTransactions
   */
  static isCompressedJsonArray(arg: any): arg is CompressedJsonTransaction[] {
    return Array.isArray(arg) && arg.every(Transaction.isCompressedJson);
  }

  /**
   * Convert Transaction to JsonTransaction
   */
  toJson(): JsonTransaction {
    return {
      time: this.date.getTime(),
      comment: this.comment,
      integerAmount: this.amount.value,
      id: this.id,
      category: {
        id: this.category.id,
        value: this.category.value,
        incomeIcon: this.category.incomeIcon,
        expenseIcon: this.category.expenseIcon,
      },
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
    };
  }

  /**
   * Convert Transaction to JsonTransaction
   */
  toCompressedJson(): CompressedJsonTransaction {
    return {
      id: this.id,
      t: this.date.getTime(),
      cid: this.category.id,
      a: this.amount.value,
      c: this.comment,
    };
  }

  /**
   * Create from Compressed
   */
  static fromCompressed(
    c: CompressedJsonTransaction,
    category: Category
  ): Transaction {
    return new Transaction(
      {
        id: c.id,
        time: c.t,
        integerAmount: c.a,
        comment: c.c,
      },
      category
    );
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
