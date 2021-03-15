import { Service } from "./Service";
import { Budget } from "../classes/Budget";
import { Success } from "../result/Success";
import { InvalidServerResponseFailure } from "../result/InvalidServerResponseFailures";

export class BudgetService extends Service {
  /**
   * Get all budgets for user as Result
   */
  static async getBudgets() {
    const result = await Service.get("/budgets", {
      service: { enableLogoutOnUnauthorized: true },
    });

    if (result.isFailure()) {
      return result;
    } else if (Budget.ArraySchema.check(result.value.data)) {
      return new Success(result.value.data);
    } else {
      return new InvalidServerResponseFailure<Budget[]>(
        result.value,
        "budgets/get"
      );
    }
  }

  /**
   * Post a budget (in json, without id or uid) and return
   * created json budget response as Result.
   */
  static async postBudget(json: JsonBudgetInitializer) {
    const result = await Service.post("/budgets", json, {
      service: { enableLogoutOnUnauthorized: true },
    });

    if (result.isFailure()) {
      return result;
    } else if (Budget.Schema.check(result.value.data)) {
      return new Success(result.value.data);
    } else {
      return new InvalidServerResponseFailure<JsonBudget>(
        result.value,
        "budgets/post"
      );
    }
  }

  /**
   * Delete a budget by ID and return empty Result.
   */
  static async deleteBudget(id: string) {
    const result = await Service.delete(`/budgets/${id}`, {
      service: { enableLogoutOnUnauthorized: true },
    });

    if (result.isFailure()) {
      return result;
    } else if (result.value.status === 200) {
      return Success.Empty();
    } else {
      return new InvalidServerResponseFailure<JsonBudget[]>(
        result.value,
        "budgets/delete"
      );
    }
  }

  /**
   * Put a budget on the server as json (upsert) and
   * return upserted json budget as Result.
   */
  static async putBudget(json: JsonBudgetInitializer & { id: string }) {
    const result = await Service.put(`/budgets/${json.id}`, json, {
      service: { enableLogoutOnUnauthorized: true },
    });

    if (result.isFailure()) {
      return result;
    } else if (Budget.Schema.check(result.value.data)) {
      return new Success(result.value.data);
    } else {
      return new InvalidServerResponseFailure<JsonBudget>(
        result.value,
        "budgets/put"
      );
    }
  }

  /**
   * Patch a budget on the server as json (partial update)
   * and return updated json budget as Result.
   */
  static async patchBudget(json: JsonBudgetInitializer & { id: string }) {
    const result = await Service.patch(`/budgets/${json.id}`, json, {
      service: { enableLogoutOnUnauthorized: true },
    });

    if (result.isFailure()) {
      return result;
    } else if (Budget.Schema.check(result.value.data)) {
      return new Success(result.value.data);
    } else {
      return new InvalidServerResponseFailure<JsonBudget[]>(
        result.value,
        "budgets/patch"
      );
    }
  }
}
