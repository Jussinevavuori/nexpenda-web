import { Service } from "./Service";
import { isJsonAuth } from "../models/authentication/auth.json";
import { Failure, Success } from "../classes/Result/Result";
import { Try } from "../classes/Result/Try";

export class AuthService extends Service {
  /**
   * Fetches the user's profile if the user is signed in.
   */
  static async getProfile() {
    return Try(async () => {
      const result = await Service.get("/auth/profile");
      if (result.isFailure()) {
        return result;
      } else if (isJsonAuth(result.value)) {
        return new Success(result.value);
      } else {
        return Failure.InvalidResponse(
          result.value,
          "auth/profile",
          "Could not get profile."
        );
      }
    });
  }

  /**
   * Registers and logs in a new user with the given credentials.
   */
  static async registerWithEmailAndPassword(credentials: {
    email: string;
    password: string;
  }) {
    return Try(async () => {
      const result = await Service.post("/auth/register", credentials);
      if (result.isFailure()) {
        return result;
      } else if (result.value.status === 200) {
        return Success.Empty();
      } else {
        return Failure.InvalidResponse(
          result.value,
          "auth/register",
          "Could not register."
        );
      }
    });
  }

  /**
   * Logs the user in with the given credentials.
   */
  static async loginWithEmailAndPassword(credentials: {
    email: string;
    password: string;
  }) {
    return Try(async () => {
      const result = await Service.post("/auth/login", credentials);
      if (result.isFailure()) {
        return result;
      } else if (result.value.status === 200) {
        return Success.Empty();
      } else {
        return Failure.InvalidResponse(
          result.value,
          "auth/login",
          "Could not login."
        );
      }
    });
  }

  /**
   * Sends a forgot password email to the given email address.
   */
  static async forgotPassword(credentials: { email: string }) {
    return Try(async () => {
      const result = await Service.post("/auth/forgot_password", credentials);
      if (result.isFailure()) {
        return result;
      } else if (result.value.status === 200) {
        return Success.Empty();
      } else {
        return Failure.InvalidResponse(
          result.value,
          "auth/forgot-password",
          "Could not send forgot password link."
        );
      }
    });
  }

  /**
   * Validates a password change token
   */
  static async validatePasswordChangeToken(credentials: { token: string }) {
    return Try(async () => {
      const result = await Service.get(
        `/auth/change_password/${credentials.token}`
      );
      if (result.isFailure()) {
        return result;
      } else if (
        result.value.status === 200 &&
        result.value.data &&
        typeof result.value.data === "string"
      ) {
        return new Success(result.value.data);
      } else {
        return Failure.InvalidResponse(
          result.value,
          "auth/change-password",
          "Could not valildate password change token."
        );
      }
    });
  }

  /**
   * Change a user's password
   */
  static async changePassword(credentials: {
    token: string;
    password: string;
  }) {
    return Try(async () => {
      const result = await Service.post(
        `/auth/change_password/${credentials.token}`,
        { password: credentials.password }
      );
      if (result.isFailure()) {
        return result;
      } else if (result.value.status === 200) {
        return Success.Empty();
      } else {
        return Failure.InvalidResponse(
          result.value,
          "auth/change-password",
          "Could not change password."
        );
      }
    });
  }

  /**
   * Confirm a user's email
   */
  static async confirmEmail(credentials: { token: string }) {
    return Try(async () => {
      const result = await Service.get(
        `/auth/confirm_email/${credentials.token}`
      );
      if (result.isFailure()) {
        return result;
      } else if (result.value.status === 200) {
        return Success.Empty();
      } else {
        return Failure.InvalidResponse(
          result.value,
          "auth/confirm-email",
          "Could not confirm email."
        );
      }
    });
  }

  /**
   * Logs the user out.
   */
  static async logout() {
    return Try(async () => {
      const result = await Service.post(`/auth/logout`);
      if (result.isFailure()) {
        return result;
      } else if (result.value.status === 200) {
        return Success.Empty();
      } else {
        return Failure.InvalidResponse(
          result.value,
          "auth/logout",
          "Could not log out."
        );
      }
    });
  }

  /**
   * Logs the user in with a Google account. Redirects the user.
   */
  static loginWithGoogle() {
    window.location.href = Service.endpoint("/auth/google");
  }
}
