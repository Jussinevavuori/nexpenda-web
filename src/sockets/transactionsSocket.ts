import io from "socket.io-client";

export const transactionsSocket = io("http://localhost:4000/transactions");

export const TransactionsSocketEvent = {
  connect: "connect",
  disconnect: "disconnect",
  create: "transactions/created",
} as const;

// transactionsSocket.on(TransactionsSocketEvent.connect, () => {
//   ("Socket connected");
// });

// transactionsSocket.on(TransactionsSocketEvent.disconnect, () => {
//   ("Socket disconnected");
// });
