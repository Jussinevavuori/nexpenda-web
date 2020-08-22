import { BaseService } from "./BaseService";
import {
  JsonTransaction,
  isJsonTransactionArray,
  isJsonTransaction,
} from "../models/transactions/transactions.json";

export class TransactionService extends BaseService {
  getTransactions() {
    return this.get<JsonTransaction[] | null>("/transactions", {
      transformResponse: (data) => (isJsonTransactionArray(data) ? data : null),
    });
  }

  async postTransaction(json: Omit<JsonTransaction, "id" | "uid">) {
    return this.post<
      Omit<JsonTransaction, "id" | "uid">,
      JsonTransaction | null
    >("/transactions", json, {
      transformResponse: (data) => (isJsonTransaction(data) ? data : null),
    });
  }

  async deleteTransaction(id: string) {
    return this.delete<boolean>(`/transactions/${id}`, {
      transformResponse: (_, headers) => headers.status === 204,
    });
  }

  async putTransaction(json: JsonTransaction) {
    return this.put<JsonTransaction, JsonTransaction | null>(
      `/transactions/${json.id}`,
      json,
      {
        transformResponse: (data) => (isJsonTransaction(data) ? data : null),
      }
    );
  }

  async patchTransaction(json: JsonTransaction) {
    return this.patch<JsonTransaction, JsonTransaction | null>(
      `/transactions/${json.id}`,
      json,
      {
        transformResponse: (data) => (isJsonTransaction(data) ? data : null),
      }
    );
  }
}
