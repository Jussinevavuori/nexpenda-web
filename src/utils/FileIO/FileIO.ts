import { Failure, Result, Success } from "../Result/Result";

export type FileIOFailure =
  | null
  | string
  | ArrayBuffer
  | ProgressEvent<FileReader>;

export type ReadFileAsArrayBufferResult = Result<ArrayBuffer, FileIOFailure>;

export type ReadFileAsTextResult = Result<string, FileIOFailure>;

export class FileIO {
  static FileReaderFailure<T>(error: ProgressEvent<FileReader>) {
    return new Failure<T, FileIOFailure>(error, {
      code: "file-io/file-reader-error",
      message: "Error reading file",
      status: 10,
    });
  }

  static FileReaderAbortedFailure<T>() {
    return new Failure<T, FileIOFailure>(null, {
      code: "file-io/aborted",
      message: "File read aborted",
      status: 10,
    });
  }

  static FileReaderMissingTargetFailure<T>() {
    return new Failure<T, FileIOFailure>(null, {
      code: "file-io/no-reader-event-target",
      message: "Reader did not provide a target",
      status: 10,
    });
  }

  static FileReaderInvalidTypeFailure<T>(value: string | ArrayBuffer | null) {
    return new Failure<T, FileIOFailure>(value, {
      code: "file-io/invalid-type",
      message: "Reader target result of invalid type",
      status: 10,
    });
  }

  static MissingFileFailure<T>() {
    return new Failure<T, FileIOFailure>(null, {
      code: "file-io/missing-file",
      message: "File not found",
      status: 10,
    });
  }

  /**
   * Create a reader with error and abortion handling, given a
   * onload callback and resolver function.
   */
  static createReader<T>(
    resolve: (value: Result<T, FileIOFailure>) => void,
    onload: (event: ProgressEvent<FileReader>) => void
  ) {
    const reader = new FileReader();

    reader.onerror = (error) => {
      resolve(FileIO.FileReaderFailure(error));
    };

    reader.onabort = () => {
      resolve(FileIO.FileReaderAbortedFailure());
    };

    reader.onload = onload;

    return reader;
  }

  /**
   * Read file from HTML input element as ArrayBuffer
   */
  static async readFileAsArrayBuffer(input: HTMLInputElement) {
    return new Promise<ReadFileAsArrayBufferResult>((resolve) => {
      const file = input.files ? input.files[0] : undefined;

      if (!file) {
        return FileIO.MissingFileFailure();
      }

      const reader = FileIO.createReader(resolve, (event) => {
        if (!event.target || event.target.result === null) {
          resolve(FileIO.FileReaderMissingTargetFailure());
        } else if (typeof event.target.result === "string") {
          resolve(FileIO.FileReaderInvalidTypeFailure(event.target.result));
        } else {
          resolve(new Success(event.target.result));
        }
      });

      reader.readAsArrayBuffer(file);
    });
  }

  /**
   * Read file from HTML input element as text
   */
  static async readFileAsText(input: HTMLInputElement) {
    return new Promise<ReadFileAsTextResult>((resolve) => {
      const file = input.files ? input.files[0] : undefined;

      if (!file) {
        return FileIO.MissingFileFailure();
      }

      const reader = FileIO.createReader(resolve, (event) => {
        if (typeof event.target?.result === "string") {
          resolve(new Success(event.target.result));
        } else if (!event.target) {
          resolve(FileIO.FileReaderMissingTargetFailure());
        } else {
          resolve(FileIO.FileReaderInvalidTypeFailure(event.target.result));
        }
      });

      reader.readAsText(file);
    });
  }
}
