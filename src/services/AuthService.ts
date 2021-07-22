import { Service } from "./Service";
import { z } from "zod";

export class AuthService extends Service {
  /**
   * Registers and logs in a new user with the given credentials.
   */
  static async registerWithEmailAndPassword(credentials: {
    email: string;
    password: string;
  }) {
    const result = await Service.post("/auth/register", credentials);
    return Service.validateResult(result, null, { status: 200 });
  }

  /**
   * Logs the user in with the given credentials.
   */
  static async loginWithEmailAndPassword(credentials: {
    email: string;
    password: string;
  }) {
    const result = await Service.post("/auth/login", credentials);
    return Service.validateResult(result, null, { status: 200 });
  }

  /**
   * Sends a reset password email to the given email address.
   */
  static async resetPassword(credentials: { email: string }) {
    const result = await Service.post("/auth/reset_password", credentials);
    return Service.validateResult(result, null, { status: 200 });
  }

  /**
   * Validates a password change token
   */
  static async validatePasswordChangeToken(credentials: { token: string }) {
    const result = await Service.get(
      `/auth/change_password/${credentials.token}`,
      {}
    );

    return Service.validateResult(result, z.string().nonempty(), {
      status: 200,
    });
  }

  /**
   * Change a user's password
   */
  static async changePassword(credentials: {
    token: string;
    password: string;
  }) {
    const result = await Service.post(
      `/auth/change_password/${credentials.token}`,
      { password: credentials.password }
    );

    return Service.validateResult(result, null, { status: 200 });
  }

  /**
   * Request new confirmation email
   */
  static async requestConfirmationEmail(credentials: { email: string }) {
    const result = await Service.post<{ email: string }>(
      `/auth/request_confirm_email`,
      credentials
    );

    return Service.validateResult(result, null, { status: 200 });
  }

  /**
   * Confirm a user's email
   */
  static async confirmEmail(credentials: { token: string }) {
    const result = await Service.post(
      `/auth/confirm_email/${credentials.token}`
    );

    return Service.validateResult(result, null, { status: 200 });
  }

  /**
   * Logs the user out.
   */
  static async logout() {
    const result = await Service.post(`/auth/logout`);

    return Service.validateResult(result, null, { status: 200 });
  }

  /**
   * Logs the user in with a Google account. Redirects the user.
   */
  static loginWithGoogle() {
    window.location.href = Service.endpoint("/auth/google");
  }
}
