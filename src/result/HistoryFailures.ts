import { Failure } from "./Failure";

export class HistoryEventAlreadyRestoredFailure<T> extends Failure<
  T,
  "already-recovered"
> {
  constructor() {
    super("already-recovered");
  }
}

export class EventNotFoundFailure<T> extends Failure<T, "event-not-found"> {
  constructor() {
    super("event-not-found");
  }
}
