import { Service } from "./Service";
import { Success } from "../result/Success";
import { InvalidServerResponseFailure } from "../result/InvalidServerResponseFailures";
import { AppConfig } from "../classes/AppConfig";

export class AppConfigService extends Service {
  /**
   * Get the current configuration
   */
  static async getAppConfig() {
    const result = await Service.get("/config", {});

    if (result.isFailure()) {
      return result;
    } else if (AppConfig.Schema.check(result.value.data)) {
      return new Success(result.value.data);
    } else {
      return new InvalidServerResponseFailure<AppConfig>(
        result.value,
        "config/get"
      );
    }
  }
}
