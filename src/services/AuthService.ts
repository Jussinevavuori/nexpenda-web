import { ServiceBase } from "./ServiceBase";
import { isJsonAuth } from "../models/authentication/auth.json";
import { ApplicationError } from "../utils/Error";

type EmailAndPassword = { email: string; password: string };

export class AuthService extends ServiceBase {
  async getProfile() {
    const response = await this.get("/auth/profile");
    const data = response.data;
    if (isJsonAuth(data)) {
      return data;
    } else {
      throw new ApplicationError(
        "auth/profile/invalid-response",
        "Invalid profile response received from server"
      );
    }
  }

  async registerWithEmailAndPassword(values: EmailAndPassword) {
    const response = await this.post("/auth/register", values);
    if (response.status !== 200) {
      throw new ApplicationError(
        "auth/register/invalid-response",
        "Invalid response received from server during registration"
      );
    }
  }

  async loginWithEmailAndPassword(values: EmailAndPassword) {
    const response = await this.post("/auth/login", values);
    if (response.status !== 200) {
      throw new ApplicationError(
        "auth/login/invalid-response",
        "Invalid response received from server during login"
      );
    }
  }

  loginWithGoogle() {
    window.location.href = this.endpoint("/auth/google");
  }

  logout() {
    window.location.href = this.endpoint("/auth/logout");
  }
}
