import { HistoryEvent } from "./HistoryEvent";

export class LoggedOutEvent extends HistoryEvent {
  constructor() {
    super("auth/logout");
  }
}
