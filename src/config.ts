import { StorageService } from "./services/StorageService";

export class Config {
  /**
   * Get the current environment
   */
  static ENVIRONMENT = process.env.NODE_ENV;

  /**
   * Check if the current environment is the given one
   */
  static isEnvironment(env: typeof process.env.NODE_ENV) {
    return process.env.NODE_ENV === env;
  }

  /**
   * Current application version number
   */
  static VERSION = "0.2.1";

  /**
   * Get the correct API URL. While in development or testing, use localhost
   * with the correct port. In production use the official API URL
   * https://api.nexpenda.com. Allow overriding the URL any time with an API
   * URL override from localStorage.
   */
  static get API_URL() {
    const env = process.env.NODE_ENV;

    // Check and use override if any
    const override = StorageService.apiUrlOverride.getValue();
    if (override) {
      return override;
    }

    // Return correct environment
    if (!env || env === "development") {
      return "http://localhost:4000";
    } else if (env === "test") {
      return "http://localhost:4001";
    } else {
      return "https://api.nexpenda.com";
    }
  }

  /**
   * Get the correct Stripe publishable key depending on the environment. Use
   * the development key while testing and developing and the live key only in
   * production.
   */
  static get STRIPE_PUBLISHABLE_KEY() {
    const env = process.env.NODE_ENV;

    // Both keys
    const test_pk =
      "pk_test_51ISd4iDUtv7qoPphHKjhNQKkSgpHHjkX79zlsIyTL29McAb1qp4ataX4BcOu7dwbTlKjoC6RjKyHbIgvdDHcBXwQ006sKRB1Uk";
    const live_pk =
      "pk_live_51ISd4iDUtv7qoPphjDvM9dY1GtLiAFcmdUejkmCOyctK2rXCdvsv3vONy56TQFIVIUE1vdToF9Rcfm2oYcyKCLBK00XKO7sHMz";

    // Return correct key depending on environment
    if (!env || env === "development" || env === "test") {
      return test_pk;
    } else {
      return live_pk;
    }
  }
}
