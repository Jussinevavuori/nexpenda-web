import io from "socket.io-client";

export const transactionsSocket = io("http://localhost:4000/transactions");

export const TransactionsSocketEvent = {
  connect: "connect",
  disconnect: "disconnect",
  read: "transactions/read",
  create: "transactions/created",
  update: "transactions/updated",
  delete: "transactions/deleted",
} as const;

transactionsSocket.on(TransactionsSocketEvent.connect, () => {});

transactionsSocket.on(TransactionsSocketEvent.disconnect, () => {});
