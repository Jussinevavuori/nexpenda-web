import Axios, { AxiosRequestConfig, AxiosError, AxiosResponse } from "axios";
import { Config } from "../config";
import { store } from "../store";
import jwt from "jsonwebtoken";
import { Success } from "../lib/Result/Success";
import { NetworkFailure } from "../lib/Result/Failures";
import { routes } from "../Routes";
import { StorageService } from "./StorageService";
import { PubSubChannel } from "../lib/PubSub/PubSubChannel";

export type ServiceRequestConfig = {
  enableLogoutOnUnauthorized?: boolean;
};

export type RequestConfig = {
  axios?: AxiosRequestConfig;
  service?: ServiceRequestConfig;
};

export class Service {
  /**
   * Subscribable for all errors
   */
  static Failuresubscribable = new PubSubChannel(
    (failure: NetworkFailure<any, { errors?: any }>) => {
      return failure;
    }
  );

  /**
   * Base URL for sending requests to the API
   */
  protected static baseURL = `${Config.API_URL}/api`;

  /**
   * Axios instance to use for sending requests
   */
  protected static axios = Axios.create({
    baseURL: Service.baseURL,
    withCredentials: true,
  });

  /**
   * Construct endpoint from path, base URL already handled
   */
  protected static endpoint(
    path: string,
    queryParams: Record<string, string | undefined> = {}
  ) {
    const query =
      Object.entries(queryParams).length === 0
        ? ""
        : "?" +
          Object.entries(queryParams)
            .filter((e) => !!e[1])
            .map((p) => `${p[0]}=${p[1]}`)
            .join("&");

    return `${Service.baseURL}${path}${query}`;
  }

  /**
   * Ensure access token is valid
   */
  protected static isAccessTokenValid() {
    const token = store.getState().auth.accessToken;
    if (!token) return false;
    try {
      const payload = jwt.decode(token) as any;
      const expiresAt = Number(payload?.exp || 0) * 1000;
      const expirationBuffer = 5000; // Fetch new access token 30 seconds before expiration
      const tokenIsValid = Date.now() < expiresAt - expirationBuffer;
      return tokenIsValid;
    } catch (error) {
      return false;
    }
  }

  /**
   * Attempt refresh access token function
   */
  protected static async attemptRefreshAccessToken(force: boolean = false) {
    const accessTokenIsValid = Service.isAccessTokenValid();
    if (!accessTokenIsValid || force) {
      const url = Service.endpoint("/auth/refresh_token");
      try {
        const result = await Service.axios.get<string>(url);
        const accessToken = result.data;
        store.getActions().auth.setAccessToken(accessToken);
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
  protected static async onBeforeRequest(
    config?: ServiceRequestConfig | undefined
  ) {
    await Service.attemptRefreshAccessToken();
  }

  /**
   * On success hook
   */
  protected static async onSuccessfulRequest(
    success: Success<AxiosResponse<any>, string>,
    config?: ServiceRequestConfig | undefined
  ) {}

  /**
   * Redirect to logout
   */
  protected static async redirectOnUnauthorized() {
    const accessToken = store.getState().auth.accessToken;
    StorageService.hadAccessToken.setValue(!!accessToken);
    if (window.location.pathname.match(/subscribe|app/)) {
      window.location.pathname = routes.logOut.path;
      window.location.search = "";
      window.location.hash = "";
    }
  }

  /**
   * On failure hook
   */
  protected static async onFailedRequest(
    failure: NetworkFailure<any, { errors?: any }>,
    config?: ServiceRequestConfig | undefined
  ) {
    if (
      failure.code === "auth/unauthenticated" &&
      config?.enableLogoutOnUnauthorized
    ) {
      this.redirectOnUnauthorized();
    }
  }

  /**
   * After request hook
   */
  protected static async onAfterRequest(
    result:
      | Success<AxiosResponse<any>, string>
      | NetworkFailure<any, { errors?: any }>,
    config?: ServiceRequestConfig | undefined
  ) {
    // Publish network failures
    if (result.isFailure()) {
      Service.Failuresubscribable.publish(result);
    }
  }

  /**
   * Gets basic axios config
   */
  protected static getConfig(
    override?: AxiosRequestConfig | undefined
  ): AxiosRequestConfig {
    const accessToken = store.getState().auth.accessToken;

    // Construct request headers
    const headers = { ...override?.headers };
    if (accessToken) {
      headers.Authorization = `bearer ${accessToken}`;
    }

    // Override config with headers
    return { ...override, headers };
  }

  /**
   * Run requests with hooks and error handling
   *
   * @param requestFunction Request creator function
   */
  protected static async handleRequest<T>(
    path: string,
    queryParams: Record<string, string | undefined>,
    config: RequestConfig | undefined,
    requestFunction: (
      url: string,
      options: AxiosRequestConfig
    ) => Promise<AxiosResponse<T>>
  ) {
    // Run before request hooks
    await Service.onBeforeRequest(config?.service);

    // Request configuration
    const url = Service.endpoint(path, queryParams);
    const options = Service.getConfig(config?.axios);

    // Run request
    const result = await requestFunction(url, options)
      .then(async (value) => {
        // Get success as success, run success hooks
        const success = new Success<AxiosResponse<T>>(value);
        await Service.onSuccessfulRequest(success, config?.service);
        return success;
      })
      .catch(async (e) => {
        // Get failure as failure, run failure hooks
        const failure = NetworkFailure.FromAxiosError<T>(e as AxiosError);
        await Service.onFailedRequest(failure, config?.service);
        return failure;
      });

    // Run after request hooks
    await Service.onAfterRequest(result, config?.service);

    return result;
  }

  /**
   * Axios typed GET request wrapper with hooks
   */
  protected static async get<ResponseData = any>(
    path: string,
    queryParams: Record<string, string | undefined>,
    config?: RequestConfig | undefined
  ) {
    return Service.handleRequest(path, queryParams, config, (url, options) => {
      return Service.axios.get<ResponseData>(url, options);
    });
  }

  /**
   * Axios typed POST request wrapper with hooks
   */
  protected static async post<RequestData = any, ResponseData = any>(
    path: string,
    data?: RequestData,
    config?: RequestConfig
  ) {
    return Service.handleRequest(path, {}, config, (url, options) => {
      return Service.axios.post<ResponseData>(url, data, options);
    });
  }

  /**
   * Axios typed DELETE request wrapper with hooks
   */
  protected static async delete<ResponseData = any>(
    path: string,
    queryParams: Record<string, string | undefined>,
    config?: RequestConfig | undefined
  ) {
    return Service.handleRequest(path, {}, config, (url, options) => {
      return Service.axios.delete<ResponseData>(url, options);
    });
  }

  /**
   * Axios typed PUT request wrapper with hooks
   */
  protected static async put<RequestData = any, ResponseData = any>(
    path: string,
    data?: RequestData,
    config?: RequestConfig
  ) {
    return Service.handleRequest(path, {}, config, (url, options) => {
      return Service.axios.put<ResponseData>(url, data, options);
    });
  }

  /**
   * Axios typed PATCH request wrapper with hooks
   */
  protected static async patch<RequestData = any, ResponseData = any>(
    path: string,
    data?: RequestData,
    config?: RequestConfig
  ) {
    return Service.handleRequest(path, {}, config, (url, options) => {
      return Service.axios.patch<ResponseData>(url, data, options);
    });
  }
}
