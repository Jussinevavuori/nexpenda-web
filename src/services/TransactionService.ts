import { BaseService } from "./BaseService";
import { TransactionConstructable } from "../models/transactions/transactions.constructable";

export class TransactionService extends BaseService {
  getTransactions() {
    return this.get<TransactionConstructable[]>("/transactions");
  }

  postTransaction(constructable: TransactionConstructable) {
    return this.post<TransactionConstructable, TransactionConstructable>(
      "/transactions",
      constructable
    );
  }

  deleteTransaction(id: string) {
    return this.delete(`/transactions/${id}`);
  }

  patchTransaction(constructable: TransactionConstructable) {
    if (constructable.id) {
      return this.patch<TransactionConstructable, TransactionConstructable>(
        `/transactions/${constructable.id}`
      );
    }
  }
}
