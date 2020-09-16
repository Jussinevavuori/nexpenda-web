import { AxiosError, AxiosResponse } from "axios";

export type Result<T = undefined, E = undefined> =
  | Success<T, E>
  | Failure<T, E>;

interface IResult<T = undefined, E = undefined> {
  /**
   * The current value, either the success or failure value
   */
  value: T | E;

  /**
   * Currently stored value, whether it is the success value or failure value
   */
  getOr(fallbackValue: T): T;

  /**
   * Check if this ``Result`` is a success
   */
  isSuccess(): this is Success<T, E>;

  /**
   * Check if this ``Result`` is a failure
   */
  isFailure(): this is Failure<T, E>;

  /**
   * If the ``Result`` succeeds, the provided callback function is ran with the
   * success value. This is an alternative to saying
   *
   * ```
   * if (result.isSuccess()) {
   *   callback(result.value)
   * }
   * ```
   */
  onSuccess(callback: (value: T) => void): this;

  /**
   * If the ``Result`` fails, the provided callback function is ran with the
   * failure value. This is an alternative to saying
   *
   * ```
   * if (result.isFailure()) {
   *   callback(result.value)
   * }
   * ```
   */
  onFailure(callback: (value: Failure<T, E>) => void): this;
}

/**
 * Success implementation
 */
export class Success<T = undefined, E = undefined> implements IResult<T, E> {
  value: T;

  constructor(value: T) {
    this.value = value;
  }

  getOr(fallbackValue: T): T {
    return this.value;
  }

  isSuccess(): this is Success<T, E> {
    return true;
  }

  isFailure(): this is Failure<T, E> {
    return false;
  }

  onSuccess(callback: (value: T) => void): this {
    callback(this.value);
    return this;
  }

  onFailure(callback: (value: Failure<T, E>) => void): this {
    return this;
  }

  static From<R = any, U = any>(value: U) {
    return new Success<U, R>(value);
  }

  static Empty<R = any>() {
    return new Success<undefined, R>(undefined);
  }
}

/**
 * Failure implementation
 */
export class Failure<T = undefined, E = undefined> implements IResult<T, E> {
  /**
   * Detailed information on the failure: Failure message.
   *
   * More human readable message for displaying to the user or
   * for debugging purposes.
   */
  message: string;

  /**
   * Detailed information on the failure: Failure status code.
   *
   * Codes
   * - `0-9` Generic failures and errors
   *   - `0` Unknown failure
   *   - `1` Caught error
   *   - `2` Unimplemented failure
   * - `10-19` Local failure
   *   - `10` Any local failure
   * - `20-29` Local network and service failures
   *   - `21` Network error or could not reach server
   *   - `22` Could not formulate request
   *   - `23` Invalid data received from server
   * - `100 - 599` Reserved for corresponding HTTP codes
   */
  status: number;

  /**
   * Detailed information on the failure: Failure error code.
   *
   * Code defines a stringified code presenting more information on
   * what caused the failure and where it occured.
   */
  code: string;

  /**
   * Details is an object which wraps status, code and message into
   * a signle object.
   */
  details: {
    message: string;
    status: number;
    code: string;
  };

  /**
   * Data if any is given
   */
  value: E;

  constructor(
    /**
     * Failure value.
     */
    value: E,

    /**
     * More specific failure options. If not given, will use
     * default failure options.
     */
    options?: {
      /**
       * Detailed information on the failure: Failure message.
       *
       * More human readable message for displaying to the user or
       * for debugging purposes.
       */

      message?: Failure["message"];

      /**
       * Detailed information on the failure: Failure status code.
       *
       * Codes
       * - `0-9` Generic failures and errors
       *   - `0` Unknown failure
       *   - `1` Caught error
       *   - `2` Unimplemented failure
       * - `10-19` Local failure
       *   - `10` Any local failure
       * - `20-29` Local network and service failures
       *   - `21` Network error or could not reach server
       *   - `22` Could not formulate request
       *   - `23` Invalid data received from server
       * - `100 - 599` Reserved for corresponding HTTP codes
       */
      status?: Failure["status"];

      /**
       * Detailed information on the failure: Failure error code.
       *
       * Code defines a stringified code presenting more information on
       * what caused the failure and where it occured.
       */
      code?: Failure["code"];
    }
  ) {
    this.details = {
      message: options?.message ?? "Unknown failure.",
      status: options?.status ?? 0,
      code: options?.code ?? "failure/unknown",
    };
    this.message = this.details.message;
    this.status = this.details.status;
    this.code = this.details.code;
    this.value = value;
  }

  getOr(fallbackValue: T): T {
    return fallbackValue;
  }

  onSuccess(callback: (value: T) => void): this {
    return this;
  }

  onFailure(callback: (value: Failure<T, E>) => void): this {
    callback(this);
    return this;
  }

  isSuccess(): this is Success<T, E> {
    return false;
  }

  isFailure(): this is Failure<T, E> {
    return true;
  }

  // Defining common failure types as static factory methods

  /**
   * Generate a failure from an Axios error.
   */
  static AxiosError<T = undefined>(
    axiosError: AxiosError
  ): Failure<T, { errors?: object }> {
    if (axiosError.response) {
      const error = axiosError.response.data;
      return new Failure<T, { errors?: object }>(
        error?.errors && typeof error.errors === "object"
          ? { errors: error.errors }
          : {},
        {
          status: axiosError.response.status,
          message:
            error?.message && typeof error.message === "string"
              ? error.message
              : "Unknown server error",
          code:
            error?.code && typeof error.code === "string"
              ? error.code
              : "server/unknown",
        }
      );
    } else if (axiosError.request) {
      return new Failure<T, { errors?: object }>(
        {},
        {
          status: 21,
          code: "server/unavailable",
          message: "Could not reach server",
        }
      );
    } else {
      return new Failure<T, { errors?: object }>(
        {},
        {
          status: 22,
          code: "server/failure-formulating-request",
          message: "Could not formulate request to server",
        }
      );
    }
  }

  /**
   * Invalid server response Failure
   *
   * This method is purposed for Services
   */
  static InvalidResponse<T = undefined>(
    response: AxiosResponse<any>,
    codePrefix: string = "failure",
    description: string = ""
  ) {
    return new Failure<T, { errors?: object; response: AxiosResponse<any> }>(
      { response },
      {
        status: 23,
        code: `${codePrefix}/invalid-response`,
        message: `${description} Invalid response from server.`.trim(),
      }
    );
  }

  /**
   * Unimplemented Failure.
   */
  static Unimplemented<T = undefined>() {
    return new Failure<T, undefined>(undefined, {
      code: "failure/unimplemented",
      message: "Unimplemented feature",
      status: 2,
    });
  }

  /**
   * Failure from thrown error
   */
  static Error<T = undefined>(error: Error) {
    return new Failure<T, Error>(error, {
      message: error.message,
      code: `error/${error.name}`,
      status: 1,
    });
  }

  /**
   * Unknonw failure
   */
  static Unknown<T = undefined>() {
    return new Failure<T, undefined>(undefined);
  }
}
