import { Failure } from "./Failure";

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
