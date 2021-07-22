import { z } from "zod";
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

  static ArraySchema = z.array(TransactionSchedule.Schema);
}
