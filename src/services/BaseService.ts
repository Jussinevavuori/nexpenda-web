import Axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosError,
  AxiosTransformer,
} from "axios";
import { Config } from "../config";
import { store } from "../store";
import jwt from "jsonwebtoken";
import { toServerError, ServerError } from "../utils/ServerError";

export class BaseService {
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
    return {
      headers: {
        Authorization: `bearer ${String(accessToken)}`,
      },
      ...override,
      transformResponse: (data, headers) => {
        let transformers: AxiosTransformer[] = [];
        const defaultTransformers = this.axios.defaults.transformResponse;
        const overrideTransformers = override?.transformResponse;
        if (defaultTransformers) {
          if (Array.isArray(defaultTransformers)) {
            transformers.push(...defaultTransformers);
          } else {
            transformers.push(defaultTransformers);
          }
        }
        if (overrideTransformers) {
          if (Array.isArray(overrideTransformers)) {
            transformers.push(...overrideTransformers);
          } else {
            transformers.push(overrideTransformers);
          }
        }
        return transformers.reduce(
          (_data, nextTransformer) => nextTransformer(_data, headers),
          data
        );
      },
    };
  }

  /**
   * Axios error handler function
   */
  protected handleAxiosError(_error: any) {
    if (_error.isAxiosError) {
      const error = _error as AxiosError<ServerError>;
      if (error.response) {
        error.response.data = toServerError(error.response.data);
      } else {
        error.response = {
          config: {},
          data: {
            code: "error/unknown-axios-error",
            status: -1,
            message: "Unknown axios error",
          },
          headers: {},
          status: -1,
          statusText: "",
        };
      }
      return error.response;
    } else {
      throw _error;
    }
  }

  /**
   * Axios typed GET request wrapper with hooks
   */
  protected async get<ResponseData = any>(
    path: string,
    config?: AxiosRequestConfig | undefined
  ) {
    const url = this.endpoint(path);
    await this.onBeforeRequest();
    const options = { ...this.getConfig(config) };
    return this.axios
      .get<ResponseData>(url, options)
      .catch(this.handleAxiosError);
  }

  /**
   * Axios typed POST request wrapper with hooks
   */
  protected async post<RequestData = any, ResponseData = any>(
    path: string,
    data?: RequestData,
    config?: AxiosRequestConfig
  ) {
    const url = this.endpoint(path);
    await this.onBeforeRequest();
    const options = { ...this.getConfig(config) };
    return this.axios
      .post<ResponseData>(url, data, options)
      .catch(this.handleAxiosError);
  }

  /**
   * Axios typed DELETE request wrapper with hooks
   */
  protected async delete<ResponseData = any>(
    path: string,
    config?: AxiosRequestConfig | undefined
  ) {
    const url = this.endpoint(path);
    await this.onBeforeRequest();
    const options = { ...this.getConfig(config) };
    return this.axios
      .delete<ResponseData>(url, options)
      .catch(this.handleAxiosError);
  }

  /**
   * Axios typed PUT request wrapper with hooks
   */
  protected async put<RequestData = any, ResponseData = any>(
    path: string,
    data?: RequestData,
    config?: AxiosRequestConfig
  ) {
    const url = this.endpoint(path);
    await this.onBeforeRequest();
    const options = { ...this.getConfig(config) };
    return this.axios
      .put<ResponseData>(url, data, options)
      .catch(this.handleAxiosError);
  }

  /**
   * Axios typed PATCH request wrapper with hooks
   */
  protected async patch<RequestData = any, ResponseData = any>(
    path: string,
    data?: RequestData,
    config?: AxiosRequestConfig
  ) {
    const url = this.endpoint(path);
    await this.onBeforeRequest();
    const options = { ...this.getConfig(config) };
    return this.axios
      .patch<ResponseData>(url, data, options)
      .catch(this.handleAxiosError);
  }
}
