import { RequestConfig, Service } from "./Service";
import { TransactionSchedule } from "../lib/DataModels/TransactionSchedule";
import { Transaction } from "../lib/DataModels/Transaction";
import { removeProperty } from "../lib/Utilities/removeProperty";

export class ScheduleService extends Service {
  /**
   * Path
   */
  static path = "/schedules";
  static pathTo(id: string) {
    return `${this.path}/${id}`;
  }

  /**
   * Default config
   */
  static config: RequestConfig = {
    service: { enableLogoutOnUnauthorized: true },
  };

  /**
   * Get all schedules for user as Result
   */
  static async getSchedules(query: {} = {}) {
    const result = await Service.get(this.path, query, this.config);

    return Service.validateResult(result, TransactionSchedule.ArraySchema);
  }

  /**
   * Post a schedule (in json, without id or uid) and return
   * response as Result.
   */
  static async postSchedule(json: PostableTransactionSchedule) {
    const result = await Service.post(this.path, json, this.config);
    return Service.validateResult(result, TransactionSchedule.Schema);
  }

  /**
   * Patch a schedule on the server as json (partial update)
   * and return updated as Result.
   */
  static async patchSchedule(json: PatchableTransactionSchedule) {
    const result = await Service.patch(
      this.pathTo(json.id),
      removeProperty(json, "id"),
      this.config
    );

    return Service.validateResult(result, TransactionSchedule.Schema);
  }

  /**
   * Delete a schedule by ID and return empty Result. Also allow for deleting
   * all transactions belonging to the schedule.
   */
  static async deleteSchedule(options: {
    id: string;
    deleteTransactions: boolean;
  }) {
    const result = await Service.delete(
      this.pathTo(options.id),
      removeProperty(options, "id"),
      this.config
    );

    return Service.validateResult(result, null, { status: 200 });
  }

  /**
   * Create all scheduled transactions.
   */
  static async createScheduledTransactions(query: {} = {}) {
    const result = await Service.post(
      this.pathTo("create_scheduled"),
      query,
      this.config
    );

    return Service.validateResult(result, Transaction.ArraySchema);
  }
}
