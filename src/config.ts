export const config = {
  productionApiBaseURL: "https://expenceapp.herokuapp.com",
  developmentApiBaseURL: "http://localhost:4000",
  testApiBaseURL: "http://localhost:4000",
  getApiBaseURL() {
    switch (process.env.NODE_ENV) {
      case "production":
        return config.productionApiBaseURL;
      case "development":
        return config.developmentApiBaseURL;
      case "test":
        return config.testApiBaseURL;
    }
  },
};
