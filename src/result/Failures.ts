import { AxiosError } from "axios";
import { Failure } from "./Failure";

export type AnyFailure<T = any> =
  | UnimplementedFailure<T>
  | UnknownFailure<T>
  | ErrorFailure<T>
  | NetworkFailure<T, any>
  | InvalidServerResponseFailure<T>
  | FileNotUploadedFailure<T>
  | FileReaderFailure<T>
  | FileReaderAbortedFailure<T>
  | FileReaderNoEventTargetFailure<T>
  | FileReaderInvalidTypeFailure<T>
  | FileReaderMissingFileFailure<T>
  | HistoryEventAlreadyRestoredFailure<T>
  | EventNotFoundFailure<T>
  | SpreadsheetReadRowFailure<T>
  | SpreadsheetReadFileFailure<T>
  | SpreadsheetNoFileCreatedFailure<T>
  | StripeInitializationFailure<T>;

export class UnimplementedFailure<T> extends Failure<T, "unimplemented"> {
  constructor() {
    super("unimplemented");
  }
}

export class UnknownFailure<T> extends Failure<T, "unknown"> {
  constructor() {
    super("unknown");
  }
}

export class ErrorFailure<T> extends Failure<T, "error"> {
  public readonly error: Error;
  constructor(error: Error, options: { silent?: boolean } = {}) {
    super("error", options);
    this.error = error;
  }
}

export type ServerFailureCode =
  | "server/unavailable"
  | "server/failure-formulating-request"
  | "server/initialization-failure"
  | "request/invalid-request-data"
  | "request/too-many-requests"
  | "request/missing-query-parameters"
  | "request/missing-url-parameters"
  | "transaction/already-exists"
  | "transaction/not-found"
  | "transaction/limit-exceeded"
  | "budget/already-exists"
  | "budget/not-found"
  | "budget/limit-exceeded"
  | "auth/missing-token"
  | "auth/invalid-token"
  | "auth/user-has-no-password"
  | "auth/invalid-credentials"
  | "auth/unauthenticated"
  | "auth/unauthorized"
  | "auth/user-not-found"
  | "auth/user-already-exists"
  | "auth/email-not-confirmed"
  | "auth/email-already-confirmed"
  | "mail/error"
  | "image/failure"
  | "file/failure"
  | "file/too-large"
  | "database/access-failure"
  | "failure/validation"
  | "failure/unimplemented"
  | "failure/error"
  | "failure/unknown"
  | "failure/cors";

type NetworkFailureDetails<E> = {
  status: number;
  code: ServerFailureCode;
  message: string;
  data?: E;
  url?: string;
};

export class NetworkFailure<T, E = undefined> extends Failure<T, "network"> {
  public readonly details: NetworkFailureDetails<E>;
  public readonly status: number;
  public readonly message: string;
  public readonly code: ServerFailureCode;
  public readonly data?: E;
  public readonly url?: string;

  constructor(details: NetworkFailureDetails<E>) {
    super("network", {
      silent: NetworkFailure.shouldSilence(details),
    });
    this.details = details;
    this.status = details.status;
    this.message = details.message;
    this.code = details.code;
    this.data = details.data;
    this.url = details.url;

    if (process.env.NODE_ENV === "development") {
      console.error(this);
    } else {
      console.error(`E${this.code}: ${this.message} <${this.status}>`);
    }
  }

  /**
   * Check if a given network failure should be silenced based on its details.
   */
  static shouldSilence<E>(details: NetworkFailureDetails<E>) {
    // Silence /api/logs endpoint events
    if (details.url?.includes("/api/logs")) {
      return true;
    }

    // Silence /api/auth/refresh_token endpoint events
    if (details.url?.includes("/api/auth/refresh_token")) {
      return true;
    }

    // By default do not silence
    return false;
  }

  static FromAxiosError<T>(
    error: AxiosError
  ): NetworkFailure<T, { errors?: any }> {
    const url = error.config.url;

    if (error.response) {
      const data = error.response.data;
      const errors = data.data.errors;

      return new NetworkFailure<T, { errors?: object }>({
        status: error.response.status,
        message:
          typeof data?.message === "string"
            ? data.message
            : "Unknown server error. Try again later.",
        code: typeof data?.code === "string" ? data.code : "server/unknown",
        data: errors && typeof errors === "object" ? { errors: errors } : {},
        url,
      });
    } else if (error.request) {
      return new NetworkFailure<T, { errors?: object }>({
        status: 0,
        code: "server/unavailable",
        message: "Could not contact server. Try again later.",
        data: {},
        url,
      });
    } else {
      return new NetworkFailure<T, { errors?: object }>({
        status: 0,
        code: "server/failure-formulating-request",
        message: "Could not formulate request to server.",
        data: {},
        url,
      });
    }
  }
}

export class InvalidServerResponseFailure<T> extends Failure<
  T,
  "invalidServerResponse"
> {
  public readonly response: any;
  public readonly method: string;

  constructor(response: any, method: string) {
    super("invalidServerResponse");
    this.response = response;
    this.method = method;
  }
}

export class FileNotUploadedFailure<T> extends Failure<T, "file-not-uploaded"> {
  constructor() {
    super("file-not-uploaded");
  }
}

export class FileReaderFailure<T> extends Failure<T, "file-reader-failure"> {
  public readonly event?: ProgressEvent<FileReader>;

  constructor(event: ProgressEvent<FileReader>) {
    super("file-reader-failure");
    this.event = event;
  }
}

export class FileReaderAbortedFailure<T> extends Failure<
  T,
  "file-reader-aborted"
> {
  constructor() {
    super("file-reader-aborted");
  }
}

export class FileReaderNoEventTargetFailure<T> extends Failure<
  T,
  "file-reader-no-event-target"
> {
  constructor() {
    super("file-reader-no-event-target");
  }
}

export class FileReaderInvalidTypeFailure<T> extends Failure<
  T,
  "file-reader-invalid-type"
> {
  public readonly eventValue: string | ArrayBuffer | null;

  constructor(eventValue: string | ArrayBuffer | null) {
    super("file-reader-invalid-type");
    this.eventValue = eventValue;
  }
}

export class FileReaderMissingFileFailure<T> extends Failure<
  T,
  "file-reader-missing-file-failure"
> {
  constructor() {
    super("file-reader-missing-file-failure");
  }
}

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
export class SpreadsheetReadRowFailure<T> extends Failure<
  T,
  "spreadsheet-read-row-failure"
> {
  constructor() {
    super("spreadsheet-read-row-failure", { silent: true });
  }
}

export class SpreadsheetReadFileFailure<T> extends Failure<
  T,
  "spreadsheet-read-file-failure"
> {
  constructor() {
    super("spreadsheet-read-file-failure");
  }
}

export class SpreadsheetNoFileCreatedFailure<T> extends Failure<
  T,
  "spreadsheet-no-file-created"
> {
  constructor() {
    super("spreadsheet-no-file-created");
  }
}
export class StripeInitializationFailure<T> extends Failure<
  T,
  "stripe-initialization-failure"
> {
  constructor() {
    super("stripe-initialization-failure");
  }
}
