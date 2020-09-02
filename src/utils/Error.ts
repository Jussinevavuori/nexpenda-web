export class ApplicationError extends Error {
  code: string;
  isApplicationError: true;

  constructor(code: string, message: string) {
    super(message);

    this.name = code;
    this.code = code;
    this.isApplicationError = true;
  }
}

export class ServerError extends ApplicationError {
  status: number;
  isServerError: true;

  constructor(code: string, message: string, status: number) {
    super(code, message);
    this.status = status;
    this.isServerError = true;
  }
}
