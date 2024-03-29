import { z } from "zod";
import { Log } from "../lib/DataModels/Log";
import { exposeToWindow } from "../lib/Utilities/exposeToWindow";
import { Service } from "./Service";

type Loggable = {
  message?: string;
  data?: any;
  disablePrint?: boolean;
  disablePost?: boolean;
};

export class LogService extends Service {
  /**
   * Posts a log to the server.
   *
   * @param log The postable log instance
   */
  private static async postLog(log: Log) {
    const result = await Service.post("/logs", log.toJson());
    const idObjectSchema = z.object({ id: z.string() });
    return Service.validateResult(result, idObjectSchema);
  }

  /**
   * Depending on the type of the log (info, warn, error) returns the correct
   * console logging method (console.info, console.warn, console.error).
   *
   * @param type Type of log
   *
   * @returns Console logging method
   */
  private static getConsolePrinterMethod(type: Log["type"]) {
    switch (type) {
      case "error":
        return console.error;
      case "info":
        return console.info;
      case "warn":
        return console.warn;
    }
  }

  /**
   * Generic logging function which handles any type and any loggable.
   * Creates the log object and prints it to the console and saves it to
   * the server unless either has been disabled.
   *
   * @param options Contains the created log instance and options.
   */
  private static async _log(options: {
    log: Log;
    disablePrint?: boolean;
    disablePost?: boolean;
  }) {
    if (!options.disablePrint) {
      const print = LogService.getConsolePrinterMethod(options.log.type);
      print(options.log.message, options.log, options.log.data);
    }

    if (!options.disablePost) {
      await LogService.postLog(options.log);
    }
  }

  /**
   * Creates an info log and prints it to the console and saves it to
   * the server unless either has been disabled.
   */
  static async info(options: Loggable) {
    const log = new Log({
      type: "info",
      message: options.message,
      data: options.data,
    });

    LogService._log({
      log,
      disablePost: options.disablePost,
      disablePrint: options.disablePrint,
    });
  }

  /**
   * Creates a warning log and prints it to the console and saves it to
   * the server unless either has been disabled.
   */
  static async warn(options: Loggable) {
    const log = new Log({
      type: "warn",
      message: options.message,
      data: options.data,
    });

    LogService._log({
      log,
      disablePost: options.disablePost,
      disablePrint: options.disablePrint,
    });
  }

  /**
   * Creates an error log and prints it to the console and saves it to
   * the server unless either has been disabled.
   */
  static async error(options: Loggable) {
    const log = new Log({
      type: "error",
      message: options.message,
      data: options.data,
    });

    LogService._log({
      log,
      disablePost: options.disablePost,
      disablePrint: options.disablePrint,
    });
  }
}

exposeToWindow({ LogService });
