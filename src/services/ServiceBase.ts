import Axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from "axios";
import { Config } from "../config";
import { store } from "../store";
import jwt from "jsonwebtoken";
import { promiseToResult, Result } from "../utils/Result";
import { Problem } from "../utils/Problem";

export type ServiceMethodResponse<T = void> = Result<
  T,
  | Problem<{
      errors?: object | undefined;
    }>
  | Problem<any>
>;

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
  protected async handleRequest<T>(
    path: string,
    config: AxiosRequestConfig | undefined,
    requestFunction: (url: string, options: AxiosRequestConfig) => Promise<T>
  ) {
    /**
     * Run hooks
     */
    await this.onBeforeRequest();

    /**
     * Run request function to promise
     */
    const url = this.endpoint(path);
    const options = this.getConfig(config);
    const promise = requestFunction(url, options);

    /**
     * Create result from promise
     */
    const result = await promiseToResult(promise);

    /**
     * Map failures to Problems, automatically created from failures
     */
    return result.mapFailure((failureValue) => {
      return Problem.fromAxiosError(failureValue as AxiosError);
    });
  }

  /**
   * Axios typed GET request wrapper with hooks
   */
  protected async get<ResponseData = any>(
    path: string,
    config?: AxiosRequestConfig | undefined
  ) {
    return this.handleRequest(path, config, (url, options) => {
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
    return this.handleRequest(path, config, (url, options) => {
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
    return this.handleRequest(path, config, (url, options) => {
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
    return this.handleRequest(path, config, (url, options) => {
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
    return this.handleRequest(path, config, (url, options) => {
      return this.axios.patch<ResponseData>(url, data, options);
    });
  }
}
