import { Config } from "../../config";
import { LogService } from "../../services/LogService";
import { FailureCache } from "./FailureCache";
import { IResult } from "./Result";
import { Success } from "./Success";

/**
 * Describes a potentially failing result, as described by the `Result` class.
 *
 * A failure describes an event that can either succeed with a value of type T
 * or fail with a failure of type R. Upon success, the `Success` class should be
 * used.
 */
export class Failure<T, R = string> implements IResult<T, R> {
  public readonly resultType: "failure" = "failure";

  /**
   * Reason for this failure.
   */
  public readonly reason: R;

  /**
   * Failure cache ID
   */
  public readonly cacheId: string;

  constructor(reason: R, options: { silent?: boolean } = {}) {
    this.reason = reason;

    /**
     * Cache failure and memorize ID
     */
    this.cacheId = FailureCache.add(this);

    /**
     * Log upon creation if not silenced.
     */
    if (!options.silent) {
      // Minimal logging when not in development mode
      const minimalLogging = !Config.isEnvironment("development");

      // Create a log
      LogService.error({
        message: `Failure (${this.reason})`,
        data: { failure: this },
        disablePrint: minimalLogging,
      });

      // Only minimal logging when not in development
      if (minimalLogging) {
        console.error(`Error:`, this.reason, this.cacheId);
      }
    }
  }

  public getOr<FB>(fallback: FB): T | FB {
    return fallback;
  }

  public isSuccess(): this is Success<T, R> {
    return false;
  }

  public isFailure(): this is Failure<T, R> {
    return true;
  }

  /**
   * Get all failures from a list of results.
   */
  static All<T>(results: IResult<T>[]) {
    return results.reduce((failures, result) => {
      return result.isFailure() ? [...failures, result] : failures;
    }, [] as Array<Failure<T, string>>);
  }
}
