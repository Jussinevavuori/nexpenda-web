import { Service } from "./Service";
import { TransactionSchedule } from "../lib/DataModels/TransactionSchedule";
import { Success } from "../lib/Result/Success";
import { InvalidServerResponseFailure } from "../lib/Result/Failures";
import { Transaction } from "../lib/DataModels/Transaction";

export class ScheduleService extends Service {
  /**
   * Get all schedules for user as Result
   */
  static async getSchedules(options: {} = {}) {
    const result = await Service.get(
      "/schedules",
      {},
      {
        service: { enableLogoutOnUnauthorized: true },
      }
    );

    if (result.isFailure()) {
      return result;
    } else if (TransactionSchedule.ArraySchema.check(result.value.data)) {
      return new Success(result.value.data);
    } else {
      return new InvalidServerResponseFailure<JsonTransactionScheduleArray>(
        result.value,
        "schedules/get"
      );
    }
  }

  /**
   * Post a schedule (in json, without id or uid) and return
   * response as Result.
   */
  static async postSchedule(json: JsonTransactionScheduleInitializer) {
    const result = await Service.post("/schedules", json, {
      service: { enableLogoutOnUnauthorized: true },
    });

    if (result.isFailure()) {
      return result;
    } else if (TransactionSchedule.Schema.check(result.value.data)) {
      return new Success(result.value.data);
    } else {
      return new InvalidServerResponseFailure<JsonTransactionSchedule>(
        result.value,
        "schedules/post"
      );
    }
  }

  /**
   * Patch a schedule on the server as json (partial update)
   * and return updated as Result.
   */
  static async patchSchedule(
    json: JsonTransactionScheduleUpdater & { id: string }
  ) {
    const { id, ...data } = json;
    const result = await Service.patch(`/schedules/${id}`, data, {
      service: { enableLogoutOnUnauthorized: true },
    });

    if (result.isFailure()) {
      return result;
    } else if (TransactionSchedule.Schema.check(result.value.data)) {
      return new Success(result.value.data);
    } else {
      return new InvalidServerResponseFailure<JsonTransactionScheduleUpdater[]>(
        result.value,
        "schedules/patch"
      );
    }
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
      `/schedules/${options.id}`,
      { deleteTransactions: options.deleteTransactions ? "true" : undefined },
      { service: { enableLogoutOnUnauthorized: true } }
    );

    if (result.isFailure()) {
      return result;
    } else if (result.value.status === 200) {
      return Success.Empty();
    } else {
      return new InvalidServerResponseFailure<void>(
        result.value,
        "schedules/delete"
      );
    }
  }

  /**
   * Create all scheduled transactions.
   */
  static async createScheduledTransactions(options: {} = {}) {
    const result = await Service.post(
      `/schedules/create_scheduled`,
      {},
      { service: { enableLogoutOnUnauthorized: true } }
    );

    if (result.isFailure()) {
      return result;
    } else if (Transaction.ArraySchema.check(result.value.data)) {
      return new Success(result.value.data);
    } else {
      return new InvalidServerResponseFailure<void>(
        result.value,
        "schedules/create_scheduled"
      );
    }
  }
}
