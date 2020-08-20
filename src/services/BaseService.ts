import Axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import { config } from "../config";
import { store } from "../store";
import jwt from "jsonwebtoken";

export class BaseService {
  baseURL: string;
  axios: AxiosInstance;

  /**
   * Set up base URL and axios instance for service
   */
  constructor() {
    this.baseURL = `${config.getApiBaseURL()}/api`;
    this.axios = Axios.create({ baseURL: this.baseURL, withCredentials: true });
  }

  /**
   * Construct endpoint from path, base URL already handled
   */
  endpoint(path: string) {
    return `${this.baseURL}${path}`;
  }

  /**
   * Ensure access token is valid
   */
  isAccessTokenValid() {
    const token = store.getState().authentication.accessToken;
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
  async attemptRefreshAccessToken(force: boolean = false) {
    const accessTokenIsValid = this.isAccessTokenValid();
    if (!accessTokenIsValid || force) {
      const url = this.endpoint("/auth/refresh_token");
      try {
        const result = await this.axios.get<string>(url);
        const accessToken = result.data;
        store.getActions().authentication.setAccessToken(accessToken);
      } catch (e) {
        if (store.getState().authentication.accessToken) {
          store.getActions().authentication.logOut();
        }
      }
    }
  }

  /**
   * Before request hook
   */
  async onBeforeRequest() {
    await this.attemptRefreshAccessToken();
  }

  /**
   * After request hook
   */
  async onAfterRequest() {}

  /**
   * Gets basic axios config
   */
  getDefaultAxiosConfig(): AxiosRequestConfig {
    const accessToken = store.getState().authentication.accessToken;
    return {
      headers: {
        Authorization: `bearer ${String(accessToken)}`,
      },
    };
  }

  /**
   * Axios typed GET request wrapper with hooks
   */
  async get<T = any>(path: string, config?: AxiosRequestConfig | undefined) {
    const url = this.endpoint(path);
    await this.onBeforeRequest();
    const requestConfig = { ...config, ...this.getDefaultAxiosConfig() };
    const result = await this.axios.get<T>(url, requestConfig);
    await this.onAfterRequest();
    return result;
  }

  /**
   * Axios typed POST request wrapper with hooks
   */
  async post<RequestData = any, ResponseData = any>(
    path: string,
    data?: RequestData,
    config?: AxiosRequestConfig
  ) {
    const url = this.endpoint(path);
    await this.onBeforeRequest();
    const requestConfig = { ...config, ...this.getDefaultAxiosConfig() };
    const result = await this.axios.post<ResponseData>(url, requestConfig);
    await this.onAfterRequest();
    return result;
  }

  /**
   * Axios typed DELETE request wrapper with hooks
   */
  async delete<T = any>(path: string, config?: AxiosRequestConfig | undefined) {
    const url = this.endpoint(path);
    await this.onBeforeRequest();
    const requestConfig = { ...config, ...this.getDefaultAxiosConfig() };
    const result = await this.axios.delete<T>(url, requestConfig);
    await this.onAfterRequest();
    return result;
  }

  /**
   * Axios typed PUT request wrapper with hooks
   */
  async put<RequestData = any, ResponseData = any>(
    path: string,
    data?: RequestData,
    config?: AxiosRequestConfig
  ) {
    const url = this.endpoint(path);
    await this.onBeforeRequest();
    const requestConfig = { ...config, ...this.getDefaultAxiosConfig() };
    const result = await this.axios.put<ResponseData>(url, data, requestConfig);
    await this.onAfterRequest();
    return result;
  }

  /**
   * Axios typed PATCH request wrapper with hooks
   */
  async patch<RequestData = any, ResponseData = any>(
    path: string,
    data?: RequestData,
    config?: AxiosRequestConfig
  ) {
    const url = this.endpoint(path);
    await this.onBeforeRequest();
    const requestConfig = { ...config, ...this.getDefaultAxiosConfig() };
    const result = await this.axios.patch<ResponseData>(
      url,
      data,
      requestConfig
    );
    await this.onAfterRequest();
    return result;
  }
}
