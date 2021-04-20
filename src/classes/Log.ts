import * as device from "react-device-detect";

type LogType = "warn" | "error" | "info";

export class Log {
  /**
   * Type of log, either `warn`, `error` or `info`.
   */
  public readonly type: LogType;

  /**
   * Message of log.
   */
  public readonly message: string;

  /**
   * Stringified version of data passed to the log.
   */
  public readonly data: string;

  /**
   * Data as passed to the log. Only accessible internally.
   */
  private readonly _data: any;

  /**
   * Stack trace for the creation of this log. Not created for `info` logs.
   */
  public readonly stackTrace: string;

  /**
   * Textual description of the device on which this log was created.
   */
  public readonly device: string;

  /**
   * Timestamp of log as numeric timestamp (as in `Date.getTime()`).
   */
  public readonly timestamp: number;

  /**
   * Timestamp of log as ISO string.
   */
  public readonly timestring: string;

  /**
   * Href at the time of this log's creation.
   */
  public readonly href: string;

  constructor(options: {
    type: Log["type"];
    message?: Log["message"];
    data?: any;
  }) {
    const now = new Date();

    this.type = options.type;
    this.message = options.message ?? "No message";
    this.data = options.data ? Log.stringifyData(options.data) : "No data";
    this.stackTrace = Log.getStackTrace(this.type);
    this.device = Log.getDevice();
    this.timestamp = now.getTime();
    this.timestring = now.toISOString();
    this.href = window.location.href;

    this._data = options.data;
  }

  /**
   * Converts this log object to JSON format. Ensures no undefined values
   * by utilizing empty strings or 0-values.
   */
  toJson() {
    return {
      type: this.type ?? "",
      message: this.message ?? "",
      data: this.data ?? "",
      stackTrace: this.stackTrace ?? "",
      device: this.device ?? "",
      timestamp: this.timestamp ?? 0,
      timestring: this.timestring ?? "",
      href: this.href ?? "",
    };
  }

  /**
   * Force stringifies any data. Uses JSON.stringify with a replacer that
   * also properly stringifies errors.
   *
   * @returns Stringified version of data.
   */
  private static stringifyData(data: any): string {
    if (!data) return "";

    try {
      return JSON.stringify(data, function (key, value) {
        if (value instanceof Error) {
          return `Error { name: ${value.name}, message: ${value.message} }`;
        }
        return value;
      });
    } catch (e) {
      return `Failed to stringify data (${e.message})`;
    }
  }

  /**
   * Get current stack trace using the Error class
   *
   * @returns Current stack trace
   */
  private static getStackTrace(type: LogType) {
    if (type === "info") {
      return `No stack trace provided for INFO logs`;
    }

    const stackTrace = new Error().stack;
    if (!stackTrace) return "No stack trace available";
    return stackTrace.replace(/https?:\/\/.*\/js\//gi, "src/");
  }

  /**
   * Get current device information
   *
   * @returns Textual description of current device
   */
  private static getDevice(): string {
    return [
      `Device type: ${device.deviceType}`,
      `Browser: ${device.browserName} v${device.browserVersion} (${device.fullBrowserVersion})`,
      `Engine: ${device.engineName} v${device.engineVersion}`,
      `OS: ${device.osName} v${device.osVersion}`,
      `Mobile model: ${device.mobileModel}`,
      `Mobile vendor: ${device.mobileVendor}`,
    ].join(" / \n");
  }
}
