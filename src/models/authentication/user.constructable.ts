export interface UserConstructable {
  id: string;
  displayName: string | undefined | null;
  photoUrl: string | undefined | null;
  email: string | undefined | null;
  googleId: string | undefined | null;
}

function isNonEmptyString(arg: any): arg is string {
  return typeof arg === "string" && arg.length > 0;
}

function isStringOrNullish(arg: any): arg is string | null | undefined {
  return typeof arg === "string" || arg === undefined || arg === null;
}

export function isUserConstructable(arg: any): arg is UserConstructable {
  if (typeof arg !== "object") return false;
  if (!isNonEmptyString(arg.id)) return false;
  if (!isStringOrNullish(arg.displayName)) return false;
  if (!isStringOrNullish(arg.googleId)) return false;
  if (!isStringOrNullish(arg.photoUrl)) return false;
  if (!isStringOrNullish(arg.email)) return false;
  return true;
}
