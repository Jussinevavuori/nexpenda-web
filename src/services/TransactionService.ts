import { RequestConfig, Service } from "./Service";
import { Transaction } from "../lib/DataModels/Transaction";
import { removeProperty } from "../lib/Utilities/removeProperty";

export class TransactionService extends Service {
  /**
   * Path
   */
  static path = "/transactions";
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
   * Get all transactions for user as Result
   */
  static async getTransactions(
    query: {
      after?: Date;
      before?: Date;
      scheduleId?: string;
    } = {}
  ) {
    const result = await Service.get(this.path, query, this.config);
    return Service.validateResult(result, Transaction.CompressedSchema);
  }

  /**
   * Create a transaction
   */
  static async postTransaction(json: PostableTransaction) {
    const result = await Service.post(this.path, json, this.config);
    return Service.validateResult(result, Transaction.Schema);
  }

  /**
   * Upsert a transaction
   */
  static async putTransaction(json: PuttableTransaction) {
    const result = await Service.put(
      this.pathTo(json.id),
      removeProperty(json, "id"),
      this.config
    );
    return Service.validateResult(result, Transaction.Schema);
  }

  /**
   * Partially update a transaction
   */
  static async patchTransaction(json: PatchableTransaction) {
    const result = await Service.patch(
      this.pathTo(json.id),
      removeProperty(json, "id"),
      this.config
    );
    return Service.validateResult(result, Transaction.Schema);
  }

  /**
   * Delete a transaction
   */
  static async deleteTransaction(id: string) {
    const result = await Service.delete(this.pathTo(id), {}, this.config);
    return Service.validateResult(result, null, { status: 200 });
  }

  /**
   * Post many transactions by IDs and return created json transactions as result.
   */
  static async massPostTransactions(jsons: PostableTransaction[]) {
    const result = await Service.post(
      this.pathTo(`mass/post`),
      { transactions: jsons },
      this.config
    );

    return Service.validateResult(result, Transaction.CompressedSchema, {
      status: 201,
    });
  }

  /**
   * Delete many transactions by IDs and return empty Result.
   */
  static async massDeleteTransactions(ids: string[]) {
    const result = await Service.post(
      this.pathTo(`mass/delete`),
      { ids },
      this.config
    );

    return Service.validateResult(result, null, { status: 200 });
  }
}
