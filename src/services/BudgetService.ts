import { RequestConfig, Service } from "./Service";
import { Budget } from "../lib/DataModels/Budget";
import { removeProperty } from "../lib/Utilities/removeProperty";

export class BudgetService extends Service {
  /**
   * Path
   */
  static path = "/budgets";
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
   * Get all budgets
   */
  static async getBudgets(query: {} = {}) {
    const result = await Service.get(this.path, query, this.config);
    return Service.validateResult(result, Budget.ArraySchema);
  }

  /**
   * Create a budget
   */
  static async postBudget(json: PostableBudget) {
    const result = await Service.post(this.path, json, this.config);
    return Service.validateResult(result, Budget.Schema);
  }

  /**
   * Upsert a budget
   */
  static async putBudget(json: PuttableBudget) {
    const result = await Service.put(
      this.pathTo(json.id),
      removeProperty(json, "id"),
      this.config
    );
    return Service.validateResult(result, Budget.Schema);
  }

  /**
   * Partially update a budget
   */
  static async patchBudget(json: PatchableBudget) {
    const result = await Service.patch(
      this.pathTo(json.id),
      removeProperty(json, "id"),
      this.config
    );
    return Service.validateResult(result, Budget.Schema);
  }

  /**
   * Delete a budget
   */
  static async deleteBudget(id: string) {
    const result = await Service.patch(this.pathTo(id), {}, this.config);
    return Service.validateResult(result, null, { status: 200 });
  }
}
