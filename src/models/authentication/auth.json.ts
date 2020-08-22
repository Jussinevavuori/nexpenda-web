import { object, string, ObjectSchema } from "yup";

export type JsonAuth = {
  id: string;
  displayName: string | undefined;
  photoUrl: string | undefined;
  email: string | undefined;
  googleId: string | undefined;
};

export const jsonAuthSchema: ObjectSchema<JsonAuth> = object({
  id: string().required().min(1),
  displayName: string(),
  photoUrl: string(),
  email: string(),
  googleId: string(),
}).required();

export function isJsonAuth(arg: any): arg is JsonAuth {
  try {
    jsonAuthSchema.isValidSync(arg);
    return true;
  } catch (error) {
    return false;
  }
}
