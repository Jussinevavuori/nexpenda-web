import { Service } from "./Service";
import {
  JsonTransaction,
  isJsonTransactionArray,
  isJsonTransaction,
} from "../models/transactions/transactions.json";
import { Failure, Success } from "../classes/Result/Result";
import { Try } from "../classes/Result/Try";

export class TransactionService extends Service {
  /**
   * Get all transactions for user as Result
   */
  static async getTransactions() {
    return Try(async () => {
      const result = await Service.get("/transactions");
      if (result.isFailure()) {
        return result;
      } else if (isJsonTransactionArray(result.value.data)) {
        return new Success(result.value.data);
      } else {
        return Failure.InvalidResponse(
          result.value,
          "transactions/get",
          "Could not get transactions."
        );
      }
    });
  }

  /**
   * Post a transaction (in json, without id or uid) and return
   * created json transaction response as Result.
   */
  static async postTransaction(json: Omit<JsonTransaction, "id" | "uid">) {
    return Try(async () => {
      const result = await Service.post("/transactions", json);
      if (result.isFailure()) {
        return result;
      } else if (isJsonTransaction(result.value.data)) {
        return new Success(result.value.data);
      } else {
        return Failure.InvalidResponse(
          result.value,
          "transactions/post",
          "Could not post transaction."
        );
      }
    });
  }

  /**
   * Delete a transaction by ID and return empty Result.
   */
  static async deleteTransaction(id: string) {
    return Try(async () => {
      const result = await Service.delete(`/transactions/${id}`);
      if (result.isFailure()) {
        return result;
      } else if (result.value.status === 200) {
        return Success.Empty();
      } else {
        return Failure.InvalidResponse(
          result.value,
          "transactions/delete",
          "Could not delete transaction."
        );
      }
    });
  }

  /**
   * Put a transaction on the server as json (upsert) and
   * return upserted json transaction as Result.
   */
  static async putTransaction(json: JsonTransaction) {
    return Try(async () => {
      const result = await Service.put(`/transactions/${json.id}`, json);
      if (result.isFailure()) {
        return result;
      } else if (isJsonTransaction(result.value.data)) {
        return new Success(result.value.data);
      } else {
        return Failure.InvalidResponse(
          result.value,
          "transactions/put",
          "Could not put transaction"
        );
      }
    });
  }

  /**
   * Patch a transaction on the server as json (partial update)
   * and return updated json transaction as Result.
   */
  static async patchTransaction(json: JsonTransaction) {
    return Try(async () => {
      const result = await Service.patch(`/transactions/${json.id}`, json);
      if (result.isFailure()) {
        return result;
      } else if (isJsonTransaction(result.value.data)) {
        return new Success(result.value.data);
      } else {
        return Failure.InvalidResponse(
          result.value,
          "transactions/patch",
          "Could not patch transaction."
        );
      }
    });
  }
}
