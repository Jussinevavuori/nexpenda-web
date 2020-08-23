import { BaseService } from "./BaseService";
import { isJsonAuth, JsonAuth } from "../models/authentication/auth.json";

type EmailAndPassword = { email: string; password: string };

export class AuthService extends BaseService {
  getProfile() {
    return this.get<JsonAuth | null>("/auth/profile", {
      transformResponse: [(data) => (isJsonAuth(data) ? data : null)],
    });
  }

  registerWithEmailAndPassword(values: EmailAndPassword) {
    return this.post<EmailAndPassword, boolean>("/auth/register", values, {
      transformResponse: [
        (_, headers) => {
          return headers.status === 200;
        },
      ],
    });
  }

  async loginWithEmailAndPassword(values: { email: string; password: string }) {
    return this.post<EmailAndPassword, boolean>("/auth/login", values, {
      transformResponse: [
        (_, headers) => {
          return headers.status === 200;
        },
      ],
    });
  }

  loginWithGoogle() {
    window.location.href = this.endpoint("/auth/google");
  }

  logout() {
    window.location.href = this.endpoint("/auth/logout");
  }
}
