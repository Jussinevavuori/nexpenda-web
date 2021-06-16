import * as uuid from "uuid";
import { MoneyAmount } from "./MoneyAmount";
import * as z from "zod";
import { DateUtils } from "../utils/DateUtils/DateUtils";
import { Category } from "./Category";
import { DataUtils } from "../utils/DataUtils/DataUtils";
import { lightFormat } from "date-fns";
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
   * Transaction creation timestamp
   */
  public readonly createdAt: Date;

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

    // Timestamp to date
    this.createdAt = new Date(json.time);

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
   * Transaction icon: use category icon if one exists, else default to
   * using default icons based on amount sign
   */
  get icon() {
    if (this.category.icon) {
      return this.category.icon;
    } else {
      return this.amount.isPositive
        ? Category.defaultIncomeIcon
        : Category.defaultExpenseIcon;
    }
  }

  /**
   * Filters the transaction based on the given conditions
   */
  filter(searchTerm: string, startDate: Date, endDate: Date) {
    if (DateUtils.compareDate(this.date, "<", startDate)) {
      return false;
    }

    if (DateUtils.compareDate(this.date, ">", endDate)) {
      return false;
    }

    if (
      searchTerm &&
      !DataUtils.textSearch(
        searchTerm,
        ...[
          this.amount.format(),
          this.category.value,
          this.comment,
          lightFormat(this.date, "d.M.yyyy"),
        ]
      )
    ) {
      return false;
    }

    return true;
  }

  static Schema = z.object({
    id: z.string(),
    time: z.number().positive().int(),
    createdAt: z.number().positive().int(),
    integerAmount: z.number().int(),
    comment: z.string().optional(),
    category: z.object({
      id: z.string(),
      value: z.string(),
      icon: z.string(),
    }),
  });

  /**
   * Schema for validating that objects match the JsonTransactionInitializer
   * format.
   */
  static InitializerSchema = z.object({
    time: z.number().positive().int(),
    integerAmount: z.number().int(),
    comment: z.string().optional(),
    category: z.string(),
    categoryIcon: z.string().optional(),
  });

  /**
   * Schema for validating that objects match the JsonTransactionInitializer
   * format.
   */
  static IdInitializerSchema = Transaction.InitializerSchema.merge(
    z.object({
      id: z.string(),
    })
  );

  /**
   * Schema for validating that objects match the
   * CompressedTransactionsDataJson format.
   */
  static CompressedJsonSchema = z.object({
    t: z.array(
      z.object({
        id: z.string(),
        t: z.number().positive().int(),
        ca: z.number().positive().int(),
        cid: z.string(),
        a: z.number().int(),
        c: z.string().optional(),
      })
    ),
    c: z.array(
      z.object({
        id: z.string(),
        v: z.string(),
        i: z.string(),
      })
    ),
  });

  /**
   * Convert Transaction to JsonTransaction
   */
  toJson(): JsonTransaction {
    return {
      time: this.date.getTime(),
      comment: this.comment,
      integerAmount: this.amount.value,
      id: this.id,
      createdAt: this.createdAt.getTime(),
      category: {
        id: this.category.id,
        value: this.category.value,
        icon: this.category.icon,
      },
    };
  }

  /**
   * Convert Transaction to JsonTransactionInitializer
   */
  toJsonInitializer(options: {}): JsonTransactionInitializer;
  toJsonInitializer(options: { id: true }): JsonTransactionIdInitializer;
  toJsonInitializer(
    options: { id?: true } = {}
  ): JsonTransactionInitializer | JsonTransactionIdInitializer {
    const json: JsonTransactionInitializer = {
      time: this.date.getTime(),
      category: this.category.value,
      comment: this.comment,
      integerAmount: this.amount.value,
    };

    if (options.id) {
      return { ...json, id: this.id };
    } else {
      return json;
    }
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
        i: "",
      };
      return new Transaction({
        id: transaction.id,
        integerAmount: transaction.a,
        comment: transaction.c,
        time: transaction.t * 1000,
        createdAt: transaction.ca * 1000,
        category: {
          id: category.id,
          value: category.v,
          icon: category.i,
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
        return (
          DateUtils.compareDate(a.date, b.date) ||
          a.createdAt.getTime() - b.createdAt.getTime()
        );
      case "date-descending":
        return (
          DateUtils.compareDate(b.date, a.date) ||
          b.createdAt.getTime() - a.createdAt.getTime()
        );
      default:
        return 0;
    }
  }
}

// Get today's date for comparison in order to avoid creating
// too many Date objects
const today = new Date();
