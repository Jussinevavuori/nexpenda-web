import * as uuid from "uuid";
import { MoneyAmount } from "./MoneyAmount";
import { array, object, string, number, ObjectSchema } from "yup";
import { DateUtils } from "../utils/DateUtils/DateUtils";
import { Category } from "./Category";

/**
 * The (JSON) object format for a transaction.
 */
export type JsonTransaction = {
  /** The transaction's ID */
  id: string;
  /** The transaction's timestamp */
  time: number;
  /** The transaction's size */
  integerAmount: number;
  /** The transaction's comment */
  comment?: string | undefined;
  /** The transaction's category and metadata */
  category: {
    /** Category ID */
    id: string;
    /** Category's name */
    value: string;
    /** Category's income icon */
    incomeIcon: string;
    /** Category's expense icon */
    expenseIcon: string;
  };
};

/**
 * The (JSON) object format for an object to send to the server
 * for creating or updating a transaction. Leaves the category data
 * out, lets the server handle the categories.
 */
export type JsonTransactionInitializer = Omit<JsonTransaction, "category"> & {
  /** Category's value / name */
  category: string;
};

/**
 * The (JSON) object format of a compressed dataset sent to the user
 * by the server.
 */
export type CompressedTransactionsJson = {
  /** Transactions as compressed objects */
  t: {
    /** ID */
    id: string;
    /** Time */
    t: number;
    /** Category ID (refers to a category in `c`) */
    cid: string;
    /** Integer amount */
    a: number;
    /** Comment */
    c?: string | undefined;
  }[];
  /** Categories as compressed objects */
  c: {
    /** ID */
    id: string;
    /** Value (name) */
    v: string;
    /** Income icon */
    ii: string;
    /** Expense icon */
    ei: string;
  }[];
};

export class Transaction {
  /**
   * Transaction ID
   */
  public readonly id: string;

  /**
   * Transaction date and time
   */
  public readonly date: Date;

  /**
   * Transaction comment
   */
  public readonly comment: string;

  /**
   * Transaction amount
   */
  public readonly amount: MoneyAmount;

  /**
   * Transaction category
   */
  public readonly category: Category;

  /**
   * Create transaction from a JSON transaction.
   *
   * @param json Crea
   */
  constructor(json: JsonTransaction) {
    // Timestamp to date
    this.date = new Date(json.time);

    // Create category object as category
    this.category = new Category(json.category);

    // Ensure json comment string, default to empty string
    this.comment = json.comment || "";

    // Create MoneyAmount object from integerAmount, ensure integer
    this.amount = new MoneyAmount(Math.floor(json.integerAmount));

    // Use ID (if none exists, create new UUID)
    this.id = json.id || uuid.v4();
  }

  /**
   * Is the transaction upcoming, i.e. is its date in the future?
   */
  get isUpcoming() {
    return DateUtils.compareDate(this.date, ">", today);
  }

  /**
   * Schema for validating that objects match the JsonTransaction format.
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
   * Schema for validating that objects match the JsonTransactionInitializer
   * format.
   */
  static InitializerJsonSchema: ObjectSchema<JsonTransactionInitializer> = object(
    {
      id: string().required(),
      time: number().positive().integer().required(),
      category: string().required(),
      integerAmount: number().integer().required(),
      comment: string(),
    }
  ).required();

  /**
   * Schema for validating that objects match the
   * CompressedTransactionsDataJson format.
   */
  static CompressedJsonSchema: ObjectSchema<CompressedTransactionsJson> = object(
    {
      t: array()
        .of(
          object({
            id: string().required(),
            t: number().positive().integer().required(),
            cid: string().required(),
            a: number().integer().required(),
            c: string(),
          }).required()
        )
        .required(),
      c: array()
        .of(
          object({
            id: string().required(),
            v: string().required(),
            ii: string().required(),
            ei: string().required(),
          }).required()
        )
        .required(),
    }
  ).required();

  /**
   * Validates the value as a JsonTransaction
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
   * Validates the value as a JsonTransactionInitializer
   */
  static isInitializerJson(arg: any): arg is JsonTransactionInitializer {
    try {
      Transaction.InitializerJsonSchema.validateSync(arg);
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Validiates the value as a CompressedJsonTransaction
   */
  static isCompressedJson(arg: any): arg is CompressedTransactionsJson {
    try {
      Transaction.CompressedJsonSchema.validateSync(arg);
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Validiates the value as an array of JsonTransactions
   */
  static isJsonArray(arg: any): arg is JsonTransaction[] {
    return Array.isArray(arg) && arg.every(Transaction.isJson);
  }

  /**
   * Validiates the value as an array of JsonTransactionInitializers
   */
  static isInitializerJsonArray(arg: any): arg is JsonTransactionInitializer[] {
    return Array.isArray(arg) && arg.every(Transaction.isInitializerJson);
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
   * Convert Transaction to JsonTransactionInitializer
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
   * Parse compressed data to a list of transactions. Transactions with
   * invalid category ids will use an error category.
   *
   * @param data Compressed Transactions Data Json
   */
  static parseCompressedData(data: CompressedTransactionsJson): Transaction[] {
    return data.t.map((transaction) => {
      // Find category or use default value for invalid categories
      const category = data.c.find((c) => c.id === transaction.cid) ?? {
        id: "category_not_found",
        v: "Category not found",
        ii: "❓",
        ei: "❓",
      };
      return new Transaction({
        id: transaction.id,
        integerAmount: transaction.a,
        comment: transaction.c,
        time: transaction.t,
        category: {
          id: category.id,
          value: category.v,
          incomeIcon: category.ii,
          expenseIcon: category.ei,
        },
      });
    });
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

// Get today's date for comparison in order to avoid creating
// too many Date objects
const today = new Date();
