import { JsonAuth } from "./auth.json";

export class Auth {
  id: string;
  displayName?: string;
  email?: string;
  photoUrl?: string;
  googleId?: string;

  constructor(json: JsonAuth) {
    this.id = json.id;
    this.displayName = json.displayName ?? undefined;
    this.email = json.email ?? undefined;
    this.photoUrl = json.photoUrl ?? undefined;
    this.googleId = json.googleId ?? undefined;
  }
}
