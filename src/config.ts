export class Config {
  static get API_URL() {
    switch (process.env.NODE_ENV) {
      case "production":
        return "https://expenceapp.herokuapp.com";
      default:
        return "http://localhost:4000";
    }
  }
}
