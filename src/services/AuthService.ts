import { BaseService } from "./BaseService";
import { UserConstructable } from "../models/authentication/user.constructable";

type EmailAndPassword = { email: string; password: string };

export class AuthService extends BaseService {
  getProfile() {
    return this.get<UserConstructable>("/auth/profile");
  }

  registerWithEmailAndPassword(values: EmailAndPassword) {
    return this.post<EmailAndPassword, void>("/auth/register", values);
  }

  logInWithEmailAndPassword(values: { email: string; password: string }) {
    return this.post<EmailAndPassword, void>("/auth/login", values);
  }

  logInWithGoogle() {
    window.location.href = this.endpoint("/auth/google");
  }

  logOut() {
    window.location.href = this.endpoint("/auth/logout");
  }
}
