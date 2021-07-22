import { Service } from "./Service";
import { AppConfig } from "../lib/DataModels/AppConfig";

export class AppConfigService extends Service {
  /**
   * Get the current configuration
   */
  static async getAppConfig() {
    const result = await Service.get("/config", {});
    return Service.validateResult(result, AppConfig.Schema);
  }
}
