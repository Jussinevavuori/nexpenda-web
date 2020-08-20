import { UserConstructable } from "./user.constructable";

export class User {
  id: string;
  displayName?: string;
  email?: string;
  photoUrl?: string;
  googleId?: string;

  constructor(constructable: UserConstructable) {
    this.id = constructable.id;
    this.displayName = constructable.displayName || undefined;
    this.email = constructable.email || undefined;
    this.photoUrl = constructable.photoUrl || undefined;
    this.googleId = constructable.googleId || undefined;
  }
}
