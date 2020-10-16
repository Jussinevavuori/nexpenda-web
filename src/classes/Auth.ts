import { object, string, ObjectSchema } from "yup";

export type JsonAuth = {
  id: string;
  displayName: string | undefined;
  photoUrl: string | undefined;
  email: string | undefined;
  googleId: string | undefined;
};

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

  /**
   * Gets the user's 2 first initials
   */
  get initials() {
    return (this.displayName ?? this.email ?? "")
      .split(/[^a-zA-Z]/g)
      .filter(Boolean)
      .slice(0, 2)
      .map((_) => _.charAt(0))
      .map((_) => _.toUpperCase())
      .join("");
  }

  /**
   * JsonSchema defining shape of JsonAuth for yup validatioin
   */
  static JsonSchema: ObjectSchema<JsonAuth> = object({
    id: string().required().min(1),
    displayName: string(),
    photoUrl: string(),
    email: string(),
    googleId: string(),
  }).required();

  /**
   * Is the value a valid JsonAuth
   */
  static isJson(arg: any): arg is JsonAuth {
    try {
      Auth.JsonSchema.isValidSync(arg);
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Convert Auth to JsonAuth
   */
  toJson(): JsonAuth {
    return {
      id: this.id,
      displayName: this.displayName,
      email: this.email,
      googleId: this.googleId,
      photoUrl: this.photoUrl,
    };
  }
}
