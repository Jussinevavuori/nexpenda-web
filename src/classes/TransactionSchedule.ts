import * as z from "zod";
import { Category } from "./Category";
import { MoneyAmount } from "./MoneyAmount";

export class TransactionSchedule {
  /**
   * ID of schedule
   */
  id: string;

  /**
   * First occurrence of schedule
   */
  firstOccurrence: Date;

  /**
   * Total number of occurrences in schedule. If undefined, means infinite
   * occurrences.
   */
  occurrences?: number;

  /**
   * The type of the interval: day, week, month or year.
   */
  intervalType: "DAY" | "WEEK" | "MONTH" | "YEAR";

  /**
   * How many interval types are between each occurrence
   */
  intervalLength: number;

  /**
   * The category
   */
  category: Category;

  /**
   * The template amount
   */
  amount: MoneyAmount;

  /**
   * The template comment
   */
  comment: string;

  /**
   * Created at timestamp metadata
   */
  createdAt: Date;

  constructor(json: JsonTransactionSchedule) {
    this.id = json.id;
    this.firstOccurrence = new Date(json.firstOccurrence);
    this.occurrences = json.occurrences;
    this.intervalType = json.intervalType;
    this.intervalLength = json.intervalLength;
    this.category = new Category({
      id: json.category.id,
      value: json.category.value,
      icon: json.category.icon ?? "",
    });
    this.amount = new MoneyAmount(json.integerAmount);
    this.comment = json.comment ?? "";
    this.createdAt = new Date(json.createdAt);
  }

  /**
   * JSON schema
   */
  static Schema = z.object({
    id: z.string().nonempty(),
    firstOccurrence: z.number().positive().int(),
    occurrences: z.number().positive().int().optional(),
    intervalLength: z.number().positive().int(),
    intervalType: z.enum(["DAY", "WEEK", "MONTH", "YEAR"]),
    comment: z.string().optional(),
    integerAmount: z.number().int(),
    category: z.object({
      id: z.string().nonempty(),
      value: z.string(),
      icon: z.string().optional(),
    }),
    createdAt: z.number().positive().int(),
  });

  /**
   * JSON array schema
   */
  static ArraySchema = z.array(TransactionSchedule.Schema);

  /**
   * JSON schedule initializer schema
   */
  static InitializerSchema = z.object({
    intervalType: z.enum(["DAY", "WEEK", "MONTH", "YEAR"]),
    intervalLength: z.number().int().min(1),
    firstOccurrence: z.number().int(),
    occurrences: z.number().int().min(1).optional(),
    integerAmount: z.number().int(),
    category: z.string().nonempty(),
    comment: z.string().optional(),
    assignTransactions: z.array(z.string().nonempty()).optional(),
  });

  toJsonInitializer(): JsonTransactionScheduleInitializer {
    return {
      intervalType: this.intervalType,
      intervalLength: this.intervalLength,
      firstOccurrence: this.firstOccurrence.getTime(),
      occurrences: this.occurrences,
      category: this.category.value,
      integerAmount: this.amount.value,
      comment: this.comment,
      assignTransactions: undefined,
    };
  }

  /**
   * JSON schedule updater schema
   */
  static UpdaterSchema = z.object({
    intervalType: z.enum(["DAY", "WEEK", "MONTH", "YEAR"]),
    intervalLength: z.number().int().min(1),
    firstOccurrence: z.number().int(),
    occurrences: z.number().int().min(1).optional().nullable(),
    integerAmount: z.number().int(),
    category: z.string().nonempty(),
    comment: z.string().optional().nullable(),
    assignTransactions: z.array(z.string().nonempty()).optional(),
    updateAllTransactions: z.boolean().optional(),
  });
}
