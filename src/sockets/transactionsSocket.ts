import io from "socket.io-client";
import { isTransactionConstructable } from "../models/transactions/transactions.constructable";
import { store } from "../store";

export const transactionsSocket = io("http://localhost:4000/transactions");

export const TransactionsSocketEvent = {
  connect: "connect",
  disconnect: "disconnect",
  create: "transactions/created",
} as const;

transactionsSocket.on(TransactionsSocketEvent.connect, () => {
  console.log("Socket connected");
});

transactionsSocket.on(TransactionsSocketEvent.disconnect, () => {
  console.log("Socket disconnected");
});

transactionsSocket.on(
  TransactionsSocketEvent.create,
  (transactionConstructable: any) => {
    if (isTransactionConstructable(transactionConstructable)) {
      store
        .getActions()
        .transactions.createTransaction(transactionConstructable);
    }
  }
);
