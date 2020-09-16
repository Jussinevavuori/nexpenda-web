import { Failure, Result, Success } from "../Result/Result";

export type ReadFileAsTextFailureType =
  | null
  | ArrayBuffer
  | ProgressEvent<FileReader>;

export type ReadFileAsTextResult = Result<string, ReadFileAsTextFailureType>;

export async function readFileAsText(fileInputElement: HTMLInputElement) {
  return new Promise<ReadFileAsTextResult>((resolve) => {
    const file = fileInputElement.files ? fileInputElement.files[0] : undefined;

    if (!file) return undefined;

    const reader = new FileReader();

    reader.onerror = (error) => {
      resolve(
        new Failure(error, {
          code: "read-file-as-text/file-reader-error",
          message: "File reader error",
          status: 10,
        })
      );
    };

    reader.onabort = () => {
      resolve(
        new Failure(null, {
          code: "read-file-as-text/aborted",
          message: "File read aborted",
          status: 10,
        })
      );
    };

    reader.onload = (event) => {
      if (typeof event.target?.result === "string") {
        resolve(new Success(event.target.result));
      } else if (!event.target) {
        resolve(
          new Failure(event.target, {
            code: "read-file-as-text/no-reader-event-target",
            message: "Reader did not provide a target",
            status: 10,
          })
        );
      } else {
        resolve(
          new Failure(event.target.result, {
            code: "read-file-as-text/invalid-type",
            message: "Reader target result of invalid type",
            status: 10,
          })
        );
      }
    };

    reader.readAsText(file);
  });
}
