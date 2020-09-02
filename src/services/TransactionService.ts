import { ServiceBase } from "./ServiceBase";
import {
  JsonTransaction,
  isJsonTransactionArray,
  isJsonTransaction,
} from "../models/transactions/transactions.json";
import { ApplicationError } from "../utils/Error";

export class TransactionService extends ServiceBase {
  async getTransactions() {
    const response = await this.get("/transactions");
    const data = response.data;
    if (isJsonTransactionArray(data)) {
      return data;
    } else {
      throw new ApplicationError(
        "transactions/get/invalid-response",
        "Could not get transactions, received invalid response."
      );
    }
  }

  async postTransaction(json: Omit<JsonTransaction, "id" | "uid">) {
    const response = await this.post("/transactions", json);
    const data = response.data;
    if (isJsonTransaction(data)) {
      return data;
    } else {
      throw new ApplicationError(
        "transactions/post/invalid-response",
        "Could not post transaction, received invalid response."
      );
    }
  }

  async deleteTransaction(id: string) {
    const response = await this.delete(`/transactions/${id}`);
    return response.status === 204;
  }

  async putTransaction(json: JsonTransaction) {
    const response = await this.put(`/transactions/${json.id}`, json);
    const data = response.data;
    if (isJsonTransaction(data)) {
      return data;
    } else {
      throw new ApplicationError(
        "transactions/put/invalid-response",
        "Could not put transaction, received invalid response."
      );
    }
  }

  async patchTransaction(json: JsonTransaction) {
    const response = await this.patch(`/transactions/${json.id}`, json);
    const data = response.data;
    if (isJsonTransaction(data)) {
      return data;
    } else {
      throw new ApplicationError(
        "transactions/patch/invalid-response",
        "Could not patch transaction, received invalid response."
      );
    }
  }
}
