import {
  FileReaderAbortedFailure,
  FileReaderFailure,
  FileReaderInvalidTypeFailure,
  FileReaderMissingFileFailure,
  FileReaderNoEventTargetFailure,
} from "../../result/FileFailures";
import { Success } from "../../result/Success";

type FileReaderResult<T> =
  | Success<T>
  | FileReaderMissingFileFailure<T>
  | FileReaderFailure<T>
  | FileReaderAbortedFailure<T>
  | FileReaderInvalidTypeFailure<T>
  | FileReaderNoEventTargetFailure<T>;

export class FileIO {
  /**
   * Read file from HTML input element as ArrayBuffer
   */
  static async readFileAsArrayBuffer(input: HTMLInputElement) {
    return new Promise<FileReaderResult<ArrayBuffer>>((resolve) => {
      const file = input.files ? input.files[0] : undefined;

      if (!file) {
        return new FileReaderMissingFileFailure();
      }

      const reader = new FileReader();

      reader.onerror = (error) => {
        resolve(new FileReaderFailure(error));
      };

      reader.onabort = () => {
        resolve(new FileReaderAbortedFailure());
      };

      reader.onload = (event) => {
        if (!event.target || event.target.result === null) {
          resolve(new FileReaderNoEventTargetFailure());
        } else if (typeof event.target.result === "string") {
          resolve(new FileReaderInvalidTypeFailure(event.target.result));
        } else {
          resolve(new Success(event.target.result));
        }
      };

      reader.readAsArrayBuffer(file);
    });
  }

  /**
   * Read file from HTML input element as text
   */
  static async readFileAsText(input: HTMLInputElement) {
    return new Promise<FileReaderResult<string>>((resolve) => {
      const file = input.files ? input.files[0] : undefined;

      if (!file) {
        return new FileReaderMissingFileFailure();
      }

      const reader = new FileReader();

      reader.onerror = (error) => {
        resolve(new FileReaderFailure(error));
      };

      reader.onabort = () => {
        resolve(new FileReaderAbortedFailure());
      };

      reader.onload = (event) => {
        if (typeof event.target?.result === "string") {
          resolve(new Success(event.target.result));
        } else if (!event.target) {
          resolve(new FileReaderNoEventTargetFailure());
        } else {
          resolve(new FileReaderInvalidTypeFailure(event.target.result));
        }
      };

      reader.readAsText(file);
    });
  }
}
