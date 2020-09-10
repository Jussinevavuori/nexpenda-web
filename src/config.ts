export class Config {
  static get API_URL() {
    const env = process.env.NODE_ENV;
    if (!env || env === "development") {
      return "http://localhost:4000";
    } else if (env === "test") {
      return "http://localhost:4001";
    } else {
      return "https://expenceapp.herokuapp.com";
    }
  }
}
