import { Service } from "./Service";
import { Success } from "../utils/Result/Result";
import { JsonTransaction, Transaction } from "../classes/Transaction";
import { InvalidServerResponseFailure } from "../utils/Failures/InvalidServerResponseFailures";

export class TransactionService extends Service {
  /**
   * Get all transactions for user as Result
   */
  static async getTransactions() {
    const result = await Service.get("/transactions");

    if (result.isFailure()) {
      return result;
    } else if (Transaction.isJsonArray(result.value.data)) {
      return new Success(result.value.data);
    } else {
      return new InvalidServerResponseFailure<JsonTransaction[]>(
        result.value,
        "transactions/get"
      );
    }
  }

  /**
   * Post a transaction (in json, without id or uid) and return
   * created json transaction response as Result.
   */
  static async postTransaction(json: Omit<JsonTransaction, "id" | "uid">) {
    const result = await Service.post("/transactions", json);

    if (result.isFailure()) {
      return result;
    } else if (Transaction.isJson(result.value.data)) {
      return new Success(result.value.data);
    } else {
      return new InvalidServerResponseFailure<JsonTransaction>(
        result.value,
        "transactions/post"
      );
    }
  }

  /**
   * Delete a transaction by ID and return empty Result.
   */
  static async deleteTransaction(id: string) {
    const result = await Service.delete(`/transactions/${id}`);

    if (result.isFailure()) {
      return result;
    } else if (result.value.status === 204) {
      return Success.Empty();
    } else {
      return new InvalidServerResponseFailure<JsonTransaction[]>(
        result.value,
        "transactions/delete"
      );
    }
  }

  /**
   * Put a transaction on the server as json (upsert) and
   * return upserted json transaction as Result.
   */
  static async putTransaction(json: JsonTransaction) {
    const result = await Service.put(`/transactions/${json.id}`, json);

    if (result.isFailure()) {
      return result;
    } else if (Transaction.isJson(result.value.data)) {
      return new Success(result.value.data);
    } else {
      return new InvalidServerResponseFailure<JsonTransaction[]>(
        result.value,
        "transactions/put"
      );
    }
  }

  /**
   * Patch a transaction on the server as json (partial update)
   * and return updated json transaction as Result.
   */
  static async patchTransaction(json: JsonTransaction) {
    const result = await Service.patch(`/transactions/${json.id}`, json);

    if (result.isFailure()) {
      return result;
    } else if (Transaction.isJson(result.value.data)) {
      return new Success(result.value.data);
    } else {
      return new InvalidServerResponseFailure<JsonTransaction[]>(
        result.value,
        "transactions/patch"
      );
    }
  }
}
