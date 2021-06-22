import * as z from "zod";
import { Schedule } from "../Schedules/Schedule";
import { TransactionTemplate } from "./TransactionTemplate";

export class TransactionSchedule {
  /**
   * ID of schedule
   */
  id: string;

  /**
   * Schedule
   */
  schedule: Schedule;

  /**
   * Transaction template
   */
  transactionTemplate: TransactionTemplate;

  /**
   * Created at timestamp metadata
   */
  createdAt: Date;

  constructor(json: JsonTransactionSchedule) {
    this.id = json.schedule.id;
    this.schedule = new Schedule(json.schedule);
    this.transactionTemplate = new TransactionTemplate(
      json.transactionTemplate
    );
    this.createdAt = new Date(json.schedule.createdAt);
  }

  toJsonInitializer(): JsonTransactionScheduleInitializer {
    return {
      schedule: {
        firstOccurrence: this.schedule.firstOccurrence.getTime(),
        occurrences: this.schedule.occurrences,
        interval: this.schedule.interval,
      },
      transactionTemplate: {
        category: this.transactionTemplate.category.value,
        integerAmount: this.transactionTemplate.amount.value,
        comment: this.transactionTemplate.comment,
      },
      assignTransactions: undefined,
    };
  }

  // ===========================================================================
  // SCHEMAS
  // ===========================================================================

  /**
   * JSON schema
   */
  static Schema = z.object({
    transactionTemplate: z.object({
      integerAmount: z.number().int(),
      comment: z.string().optional(),
      category: z.object({
        id: z.string().nonempty(),
        value: z.string(),
        icon: z.string().optional(),
      }),
    }),
    schedule: z.object({
      id: z.string().nonempty(),
      firstOccurrence: z.number().positive().int(),
      occurrences: z.number().positive().int().optional(),
      createdAt: z.number().positive().int(),
      interval: z.object({
        type: z.enum(["DAY", "WEEK", "MONTH", "YEAR"]),
        every: z.number().positive().int(),
      }),
    }),
  });

  /**
   * JSON array schema
   */
  static ArraySchema = z.array(TransactionSchedule.Schema);

  /**
   * JSON schedule initializer schema
   */
  static InitializerSchema = z.object({
    schedule: z.object({
      firstOccurrence: z.number().int(),
      occurrences: z.number().int().min(0).optional(),
      interval: z.object({
        type: z.enum(["DAY", "WEEK", "MONTH", "YEAR"]),
        every: z.number().positive().int(),
      }),
    }),
    transactionTemplate: z.object({
      integerAmount: z.number().int(),
      category: z.string().nonempty(),
      comment: z.string().optional(),
      categoryIcon: z.string().optional(),
    }),
    assignTransactions: z.array(z.string().nonempty()).optional(),
  });

  /**
   * JSON schedule updater schema
   */
  static UpdaterSchema = z
    .object({
      schedule: z
        .object({
          firstOccurrence: z.number().int(),
          occurrences: z.number().int().min(0).optional().nullable(),
          interval: z.object({
            type: z.enum(["DAY", "WEEK", "MONTH", "YEAR"]),
            every: z.number().positive().int(),
          }),
        })
        .partial(),
      transactionTemplate: z
        .object({
          integerAmount: z.number().int(),
          category: z.string().nonempty(),
          comment: z.string().optional().nullable(),
          categoryIcon: z.string().optional(),
        })
        .partial(),
      assignTransactions: z.array(z.string().nonempty()).optional(),
      updateAllTransactions: z.boolean().optional(),
    })
    .partial();
}
