import { ServiceBase, ServiceMethodResponse } from "./ServiceBase";
import { isJsonAuth, JsonAuth } from "../models/authentication/auth.json";
import { Failure, Success } from "../utils/Result";

export class AuthService extends ServiceBase {
  /**
   * Fetches the user's profile if the user is signed in.
   */
  async getProfile(): Promise<ServiceMethodResponse<JsonAuth>> {
    const result = await this.get("/auth/profile");

    return result.ensureType(
      (response) => response.data,
      isJsonAuth,
      (response) =>
        Failure.Problem({
          status: 23,
          code: "auth/profile/invalid-response",
          message: "Invalid profile response from server",
          data: response.data,
        })
    );
  }

  /**
   * Registers and logs in a new user with the given credentials.
   */
  async registerWithEmailAndPassword(credentials: {
    email: string;
    password: string;
  }): Promise<ServiceMethodResponse> {
    const result = await this.post("/auth/register", credentials);

    return result.transform(
      (response) => response.status === 200,
      () => Success.Empty(),
      (response) =>
        Failure.Problem({
          status: 23,
          code: "auth/register/invalid-response",
          message: "Invalid registration response from server",
          data: response.data,
        })
    );
  }

  /**
   * Logs the user in with the given credentials.
   */
  async loginWithEmailAndPassword(credentials: {
    email: string;
    password: string;
  }): Promise<ServiceMethodResponse> {
    const result = await this.post("/auth/login", credentials);

    return result.transform(
      (response) => response.status === 200,
      () => Success.Empty(),
      (response) =>
        Failure.Problem({
          status: 23,
          code: "auth/login/invalid-response",
          message: "Invalid login response from server",
          data: response.data,
        })
    );
  }

  /**
   * Sends a forgot password email to the given email address.
   */
  async forgotPassword(credentials: {
    email: string;
  }): Promise<ServiceMethodResponse> {
    const result = await this.post("/auth/forgot_password", credentials);

    return result.transform(
      (response) => response.status === 200,
      () => Success.Empty(),
      (response) =>
        Failure.Problem({
          status: 23,
          code: "auth/forgotpassword/invalid-response",
          message: "Invalid forgot password response from server",
          data: response.data,
        })
    );
  }

  /**
   * Validates a password change token
   */
  async validatePasswordChangeToken(credentials: { token: string }) {
    const result = await this.get(`/auth/change_password/${credentials.token}`);

    return result.transform(
      (response) =>
        response.status === 200 && typeof response.data === "string",
      (response) => new Success(String(response.data)),
      (response) =>
        Failure.Problem({
          status: 23,
          code: "auth/changepassword/invalid-response",
          message: "Invalid change password response from server",
          data: response.data,
        })
    );
  }

  /**
   * Change a user's password
   */
  async changePassword(credentials: { token: string; password: string }) {
    const result = await this.post(
      `/auth/change_password/${credentials.token}`,
      { password: credentials.password }
    );

    return result.transform(
      (response) => response.status === 200,
      () => Success.Empty(),
      (response) =>
        Failure.Problem({
          status: 23,
          code: "auth/changepassword/invalid-response",
          message: "Invalid change password response from server",
          data: response.data,
        })
    );
  }

  /**
   * Confirm a user's email
   */
  async confirmEmail(credentials: { token: string }) {
    const result = await this.get(`/auth/confirm_email/${credentials.token}`);

    return result.transform(
      (response) => response.status === 200,
      () => Success.Empty(),
      (response) =>
        Failure.Problem({
          status: 23,
          code: "auth/confirmemail/invalid-response",
          message: "Invalid confirm email response from server",
          data: response.data,
        })
    );
  }

  /**
   * Logs the user out.
   */
  async logout() {
    const result = await this.post(`/auth/logout`);

    return result.transform(
      (response) => response.status === 200,
      () => Success.Empty(),
      (response) =>
        Failure.Problem({
          status: 23,
          code: "auth/logout/invalid-response",
          message: "Invalid logout response from server",
          data: response.data,
        })
    );
  }

  /**
   * Logs the user in with a Google account. Redirects the user.
   */
  loginWithGoogle() {
    window.location.href = this.endpoint("/auth/google");
  }
}
