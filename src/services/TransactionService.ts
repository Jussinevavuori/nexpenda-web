import { ServiceBase } from "./ServiceBase";
import {
  JsonTransaction,
  isJsonTransactionArray,
  isJsonTransaction,
} from "../models/transactions/transactions.json";
import { Failure, Success } from "../utils/Result";

export class TransactionService extends ServiceBase {
  async getTransactions() {
    const result = await this.get("/transactions");

    return result.ensureType(
      (response) => response.data,
      isJsonTransactionArray,
      (response) =>
        Failure.Problem({
          status: 23,
          code: "transactions/get/invalid-response",
          message: "Could not get transactions, received invalid response.",
          data: response.data,
        })
    );
  }

  async postTransaction(json: Omit<JsonTransaction, "id" | "uid">) {
    const result = await this.post("/transactions", json);

    return result.ensureType(
      (response) => response.data,
      isJsonTransaction,
      (response) =>
        Failure.Problem({
          status: 23,
          code: "transactions/post/invalid-response",
          message: "Could not post transaction, received invalid response.",
          data: response.data,
        })
    );
  }

  async deleteTransaction(id: string) {
    const result = await this.delete(`/transactions/${id}`);

    return result.transform(
      (response) => response.status === 200,
      () => Success.Empty(),
      (response) =>
        Failure.Problem({
          status: 23,
          code: "transactions/delete/invalid-response",
          message: "Could not delete transaction, received invalid response.",
          data: response.data,
        })
    );
  }

  async putTransaction(json: JsonTransaction) {
    const result = await this.put(`/transactions/${json.id}`, json);

    return result.ensureType(
      (response) => response.data,
      isJsonTransaction,
      (response) =>
        Failure.Problem({
          status: 23,
          code: "transactions/put/invalid-response",
          message: "Could not put transaction, received invalid response.",
          data: response.data,
        })
    );
  }

  async patchTransaction(json: JsonTransaction) {
    const result = await this.patch(`/transactions/${json.id}`, json);

    return result.ensureType(
      (response) => response.data,
      isJsonTransaction,
      (response) =>
        Failure.Problem({
          status: 23,
          code: "transactions/patch/invalid-response",
          message: "Could not patch transaction, received invalid response.",
          data: response.data,
        })
    );
  }
}
