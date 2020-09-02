import Axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from "axios";
import { Config } from "../config";
import { store } from "../store";
import jwt from "jsonwebtoken";
import { ServerError, ApplicationError } from "../utils/Error";

export abstract class ServiceBase {
  protected baseURL: string;
  protected axios: AxiosInstance;

  /**
   * Set up base URL and axios instance for service
   */
  constructor() {
    this.baseURL = `${Config.API_URL}/api`;
    this.axios = Axios.create({ baseURL: this.baseURL, withCredentials: true });
  }

  /**
   * Construct endpoint from path, base URL already handled
   */
  protected endpoint(path: string) {
    return `${this.baseURL}${path}`;
  }

  /**
   * Ensure access token is valid
   */
  protected isAccessTokenValid() {
    const token = store.getState().auth.accessToken;
    if (!token) return false;
    try {
      const payload = jwt.decode(token) as any;
      const expiresAt = Number(payload?.exp || 0) * 1000;
      const expirationBuffer = 5000; // Fetch new access token 30 seconds before expiration
      const tokenIsValid = Date.now() < expiresAt - expirationBuffer;
      return tokenIsValid;
    } catch (error) {
      console.warn("Error occured while checking access token", error);
      return false;
    }
  }

  /**
   * Attempt refresh access token function
   */
  protected async attemptRefreshAccessToken(force: boolean = false) {
    const accessTokenIsValid = this.isAccessTokenValid();
    if (!accessTokenIsValid || force) {
      const url = this.endpoint("/auth/refresh_token");
      try {
        const result = await this.axios.get<string>(url);
        const accessToken = result.data;
        store.getActions().auth._setAccessToken(accessToken);
      } catch (e) {
        if (store.getState().auth.accessToken) {
          store.getActions().auth.logout();
        }
      }
    }
  }

  /**
   * Before request hook
   */
  protected async onBeforeRequest() {
    await this.attemptRefreshAccessToken();
  }

  /**
   * Gets basic axios config
   */
  protected getConfig(
    override?: AxiosRequestConfig | undefined
  ): AxiosRequestConfig {
    const accessToken = store.getState().auth.accessToken;

    // Construct request headers
    const headers = { ...override?.headers };
    if (accessToken) {
      headers.Authorization = `bearer ${accessToken}`;
    }

    // Override config with headers
    return {
      ...override,
      headers,
    };
  }

  /**
   * Run requests with hooks and error handling
   *
   * @param requestFunction Request creator function
   */
  protected async handleRequest<T>(requestFunction: () => Promise<T>) {
    try {
      /**
       * Run hooks
       */
      await this.onBeforeRequest();

      /**
       * Run request
       */
      return requestFunction();
    } catch (error) {
      /**
       * Handle Axios errors
       */
      if (error.isAxiosError) {
        const { response, request, code, message } = error as AxiosError;

        /**
         * If response contains errors, throw new ServerError from
         * response data.
         */
        if (response) {
          const code =
            typeof response.data?.code === "string"
              ? response.data?.code
              : "server/unknown";

          const message =
            typeof response.data?.message === "string"
              ? response.data?.message
              : "Unknown server error";

          throw new ServerError(code, message, response.status);
        }

        /**
         * If response was not received, create ApplicationError for request
         */
        if (request) {
          throw new ApplicationError(
            code || "axios/request",
            message || "Error sending Axios request"
          );
        }

        /**
         * If no request was sent, an error must've occured during configuration
         */
        throw new ApplicationError(
          code || "axios/config",
          "Error during Axios config phase: " + message
        );
      }

      /**
       * If error is not Axios error, error is unknonwn
       */
      throw new ApplicationError(
        "axios/unknown",
        `Unknown error during Axios request (${error.message})`
      );
    }
  }

  /**
   * Axios typed GET request wrapper with hooks
   */
  protected async get<ResponseData = any>(
    path: string,
    config?: AxiosRequestConfig | undefined
  ) {
    return this.handleRequest(() => {
      const url = this.endpoint(path);
      const options = this.getConfig(config);
      return this.axios.get<ResponseData>(url, options);
    });
  }

  /**
   * Axios typed POST request wrapper with hooks
   */
  protected async post<RequestData = any, ResponseData = any>(
    path: string,
    data?: RequestData,
    config?: AxiosRequestConfig
  ) {
    return this.handleRequest(() => {
      const url = this.endpoint(path);
      const options = this.getConfig(config);
      return this.axios.post<ResponseData>(url, data, options);
    });
  }

  /**
   * Axios typed DELETE request wrapper with hooks
   */
  protected async delete<ResponseData = any>(
    path: string,
    config?: AxiosRequestConfig | undefined
  ) {
    return this.handleRequest(() => {
      const url = this.endpoint(path);
      const options = this.getConfig(config);
      return this.axios.delete<ResponseData>(url, options);
    });
  }

  /**
   * Axios typed PUT request wrapper with hooks
   */
  protected async put<RequestData = any, ResponseData = any>(
    path: string,
    data?: RequestData,
    config?: AxiosRequestConfig
  ) {
    return this.handleRequest(() => {
      const url = this.endpoint(path);
      const options = this.getConfig(config);
      return this.axios.put<ResponseData>(url, data, options);
    });
  }

  /**
   * Axios typed PATCH request wrapper with hooks
   */
  protected async patch<RequestData = any, ResponseData = any>(
    path: string,
    data?: RequestData,
    config?: AxiosRequestConfig
  ) {
    return this.handleRequest(() => {
      const url = this.endpoint(path);
      const options = this.getConfig(config);
      return this.axios.patch<ResponseData>(url, data, options);
    });
  }
}
