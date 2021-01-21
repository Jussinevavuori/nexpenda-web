export class Config {
  static get API_URL() {
    const env = process.env.NODE_ENV;

    const override = window.localStorage.getItem("API_URL");

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
}
