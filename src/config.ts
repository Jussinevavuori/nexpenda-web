import { StorageService } from "./services/StorageService";

export class Config {
  static get API_URL() {
    const env = process.env.NODE_ENV;

    const override = StorageService.components.apiUrlOverride.getValue();

    if (override) {
      return override;
    }

    if (!env || env === "development") {
      return "http://localhost:4000";
    } else if (env === "test") {
      return "http://localhost:4001";
    } else {
      return "https://api.nexpenda.com";
    }
  }

  static get STRIPE_PUBLISHABLE_KEY() {
    const env = process.env.NODE_ENV;

    const test_pk =
      "pk_test_51ISd4iDUtv7qoPphHKjhNQKkSgpHHjkX79zlsIyTL29McAb1qp4ataX4BcOu7dwbTlKjoC6RjKyHbIgvdDHcBXwQ006sKRB1Uk";
    const live_pk =
      "pk_live_51ISd4iDUtv7qoPphjDvM9dY1GtLiAFcmdUejkmCOyctK2rXCdvsv3vONy56TQFIVIUE1vdToF9Rcfm2oYcyKCLBK00XKO7sHMz";

    if (!env || env === "development" || env === "test") {
      return test_pk;
    } else {
      return live_pk;
    }
  }
}
