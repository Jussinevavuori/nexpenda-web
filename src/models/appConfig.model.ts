import { Action, action, Thunk, thunk } from "easy-peasy";
import { AppConfig } from "../lib/DataModels/AppConfig";
import { AppConfigService } from "../services/AppConfigService";
import { LogService } from "../services/LogService";

export interface AppConfigModel {
  /**
   * Current app config
   */
  value: AppConfig;

  /**
   * Apply a configuration
   */
  applyConfig: Action<AppConfigModel, AppConfig>;

  /**
   * Fetch the configuration
   */
  fetchConfig: Thunk<AppConfigModel>;
}

export const appConfigModel: AppConfigModel = {
  value: AppConfig.DefaultAppConfig,
  applyConfig: action((state, payload) => {
    state.value = payload;
  }),
  fetchConfig: thunk(async (actions) => {
    const config = await AppConfigService.getAppConfig();
    if (config.isFailure()) {
      LogService.error({
        message: `Failed to fetch app config`,
      });
    } else {
      actions.applyConfig(new AppConfig(config.value));
    }
  }),
};
