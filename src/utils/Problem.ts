import { AxiosError } from "axios";

/**
 * Defines properties of a problem
 */
export type IProblem<T = undefined> = {
  /**
   * Message property defines a human readable definition of the error message.
   */
  message: string;

  /**
   * Status defines a status code for the problem.
   *
   * Codes
   * - `10-19` Local error
   * - `20-29` Local network and service errors
   * - - `21` Network error or could not reach server
   * - - `22` Could not formulate request
   * - - `23` Invalid data received from server
   * - `100 - 599` Reserved for corresponding HTTP codes
   */
  status: number;

  /**
   * Code defines a stringified code of the problem for better error handling
   * and responses. Use kebab-case.
   *
   * Codes are defined as follow
   *
   * `domain/{subdomains/.../}definition`
   *
   * Following codes are examples of valid codes
   *
   * - `auth/unauthenticated`
   * - `data/already-exists`
   */
  code: string;

  /**
   * Define any extra data that is passed to the problem.
   */
  data: T;
};

export class Problem<T extends object = {}> implements IProblem<T> {
  message: string;

  status: number;

  code: string;

  data: T;

  /**
   * Construct a problem from a problem object
   */
  constructor(problem: IProblem<T>) {
    this.message = problem.message;
    this.status = problem.status;
    this.code = problem.code;
    this.data = problem.data;
  }

  /**
   * Automatically generate problem from axios error
   */
  static fromAxiosError(axiosError: AxiosError): Problem<{ errors?: object }> {
    if (axiosError.response) {
      const error = axiosError.response.data;
      return new Problem({
        status: axiosError.response.status,
        message:
          error?.message && typeof error.message === "string"
            ? error.message
            : "Unknown server error",
        code:
          error?.code && typeof error.code === "string"
            ? error.code
            : "server/unknown",
        data:
          error?.errors && typeof error.errors === "object"
            ? { errors: error.errors }
            : {},
      });
    } else if (axiosError.request) {
      return new Problem({
        status: 21,
        code: "server/unavailable",
        message: "Could not reach server",
        data: {},
      });
    } else {
      return new Problem({
        status: 22,
        code: "server/failure-formulating-request",
        message: "Could not formulate request to server",
        data: {},
      });
    }
  }
}
