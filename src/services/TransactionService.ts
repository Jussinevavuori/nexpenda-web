import { Service } from "./Service";
import { Transaction } from "../classes/Transaction";
import { Success } from "../result/Success";
import { InvalidServerResponseFailure } from "../result/Failures";

export class TransactionService extends Service {
  /**
   * Get all transactions for user as Result
   */
  static async getTransactions(
    options: {
      after?: Date;
      before?: Date;
    } = {}
  ) {
    // Construct query parameters
    const queryParams: Record<string, string> = {};
    if (options.after && options.after.getTime()) {
      queryParams["after"] = options.after.getTime().toString();
    }
    if (options.before && options.before.getTime()) {
      queryParams["before"] = options.before.getTime().toString();
    }

    const result = await Service.get("/transactions", queryParams, {
      service: { enableLogoutOnUnauthorized: true },
    });

    if (result.isFailure()) {
      return result;
    } else if (Transaction.CompressedJsonSchema.check(result.value.data)) {
      return new Success(result.value.data);
    } else {
      return new InvalidServerResponseFailure<CompressedTransactionsJson>(
        result.value,
        "transactions/get"
      );
    }
  }

  /**
   * Post a transaction (in json, without id or uid) and return
   * created json transaction response as Result.
   */
  static async postTransaction(json: JsonTransactionInitializer) {
    const result = await Service.post("/transactions", json, {
      service: { enableLogoutOnUnauthorized: true },
    });

    if (result.isFailure()) {
      return result;
    } else if (Transaction.Schema.check(result.value.data)) {
      return new Success(result.value.data);
    } else {
      return new InvalidServerResponseFailure<JsonTransaction>(
        result.value,
        "transactions/post"
      );
    }
  }
  /**
   * Post many transactions by IDs and return created json transactions as result.
   */
  static async massPostTransactions(jsons: JsonTransactionInitializer[]) {
    const result = await Service.post(
      `/transactions/mass/post`,
      { transactions: jsons },
      { service: { enableLogoutOnUnauthorized: true } }
    );

    if (result.isFailure()) {
      return result;
    } else if (
      result.value.status === 201 &&
      Transaction.CompressedJsonSchema.check(result.value.data)
    ) {
      return new Success(result.value.data);
    } else {
      return new InvalidServerResponseFailure<CompressedTransactionsJson>(
        result.value,
        "transactions/mass/post"
      );
    }
  }

  /**
   * Delete a transaction by ID and return empty Result.
   */
  static async deleteTransaction(id: string) {
    const result = await Service.delete(`/transactions/${id}`, {
      service: { enableLogoutOnUnauthorized: true },
    });

    if (result.isFailure()) {
      return result;
    } else if (result.value.status === 200) {
      return Success.Empty();
    } else {
      return new InvalidServerResponseFailure<JsonTransaction[]>(
        result.value,
        "transactions/delete"
      );
    }
  }

  /**
   * Delete many transactions by IDs and return empty Result.
   */
  static async massDeleteTransactions(ids: string[]) {
    const result = await Service.post(
      `/transactions/mass/delete`,
      { ids },
      {
        service: { enableLogoutOnUnauthorized: true },
      }
    );

    if (result.isFailure()) {
      return result;
    } else if (result.value.status === 200) {
      return Success.Empty();
    } else {
      return new InvalidServerResponseFailure<void>(
        result.value,
        "transactions/mass/delete"
      );
    }
  }

  /**
   * Put a transaction on the server as json (upsert) and
   * return upserted json transaction as Result.
   */
  static async putTransaction(
    json: JsonTransactionInitializer & { id: string }
  ) {
    const { id, ...data } = json;
    const result = await Service.put(`/transactions/${id}`, data, {
      service: { enableLogoutOnUnauthorized: true },
    });

    if (result.isFailure()) {
      return result;
    } else if (Transaction.Schema.check(result.value.data)) {
      return new Success(result.value.data);
    } else {
      return new InvalidServerResponseFailure<JsonTransaction>(
        result.value,
        "transactions/put"
      );
    }
  }

  /**
   * Patch a transaction on the server as json (partial update)
   * and return updated json transaction as Result.
   */
  static async patchTransaction(
    json: JsonTransactionInitializer & { id: string }
  ) {
    const { id, ...data } = json;
    const result = await Service.patch(`/transactions/${id}`, data, {
      service: { enableLogoutOnUnauthorized: true },
    });

    if (result.isFailure()) {
      return result;
    } else if (Transaction.Schema.check(result.value.data)) {
      return new Success(result.value.data);
    } else {
      return new InvalidServerResponseFailure<JsonTransaction[]>(
        result.value,
        "transactions/patch"
      );
    }
  }
}
