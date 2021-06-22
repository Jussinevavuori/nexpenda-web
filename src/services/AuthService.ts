import { Service } from "./Service";
import { InvalidServerResponseFailure } from "../lib/Result/Failures";
import { Success } from "../lib/Result/Success";

export class AuthService extends Service {
  /**
   * Registers and logs in a new user with the given credentials.
   */
  static async registerWithEmailAndPassword(credentials: {
    email: string;
    password: string;
  }) {
    const result = await Service.post("/auth/register", credentials);

    if (result.isFailure()) {
      return result;
    } else if (result.value.status === 200) {
      return Success.Empty();
    } else {
      return new InvalidServerResponseFailure<undefined>(
        result.value,
        "auth/register"
      );
    }
  }

  /**
   * Logs the user in with the given credentials.
   */
  static async loginWithEmailAndPassword(credentials: {
    email: string;
    password: string;
  }) {
    const result = await Service.post("/auth/login", credentials);

    if (result.isFailure()) {
      return result;
    } else if (result.value.status === 200) {
      return Success.Empty();
    } else {
      return new InvalidServerResponseFailure<undefined>(
        result.value,
        "auth/login"
      );
    }
  }

  /**
   * Sends a reset password email to the given email address.
   */
  static async resetPassword(credentials: { email: string }) {
    const result = await Service.post("/auth/reset_password", credentials);

    if (result.isFailure()) {
      return result;
    } else if (result.value.status === 200) {
      return Success.Empty();
    } else {
      return new InvalidServerResponseFailure<undefined>(
        result.value,
        "auth/reset-password"
      );
    }
  }

  /**
   * Validates a password change token
   */
  static async validatePasswordChangeToken(credentials: { token: string }) {
    const result = await Service.get(
      `/auth/change_password/${credentials.token}`,
      {}
    );

    if (result.isFailure()) {
      return result;
    } else if (
      result.value.status === 200 &&
      result.value.data &&
      typeof result.value.data === "string"
    ) {
      return new Success<string>(result.value.data);
    } else {
      return new InvalidServerResponseFailure<string>(
        result.value,
        "auth/change-password"
      );
    }
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

    if (result.isFailure()) {
      return result;
    } else if (result.value.status === 200) {
      return Success.Empty();
    } else {
      return new InvalidServerResponseFailure<void>(
        result.value,
        "auth/change-password"
      );
    }
  }

  /**
   * Request new confirmation email
   */
  static async requestConfirmationEmail(credentials: { email: string }) {
    const result = await Service.post<{ email: string }>(
      `/auth/request_confirm_email`,
      credentials
    );

    if (result.isFailure()) {
      return result;
    } else if (result.value.status === 200) {
      return Success.Empty();
    } else {
      return new InvalidServerResponseFailure<void>(
        result.value,
        "auth/request-confirm-email"
      );
    }
  }

  /**
   * Confirm a user's email
   */
  static async confirmEmail(credentials: { token: string }) {
    const result = await Service.post(
      `/auth/confirm_email/${credentials.token}`
    );

    if (result.isFailure()) {
      return result;
    } else if (result.value.status === 200) {
      return Success.Empty();
    } else {
      return new InvalidServerResponseFailure<void>(
        result.value,
        "auth/confirm-email"
      );
    }
  }

  /**
   * Logs the user out.
   */
  static async logout() {
    const result = await Service.post(`/auth/logout`);

    if (result.isFailure()) {
      return result;
    } else if (result.value.status === 200) {
      return Success.Empty();
    } else {
      return new InvalidServerResponseFailure<void>(
        result.value,
        "auth/logout"
      );
    }
  }

  /**
   * Logs the user in with a Google account. Redirects the user.
   */
  static loginWithGoogle() {
    window.location.href = Service.endpoint("/auth/google");
  }
}
