import { Service } from "./Service";
import { Auth, JsonAuth, UpdatableJsonAuthFields } from "../classes/Auth";
import { InvalidServerResponseFailure } from "../result/InvalidServerResponseFailures";
import { Success } from "../result/Success";

export class ProfileService extends Service {
  /**
   * Fetches the user's profile if the user is signed in.
   */
  static async getProfile() {
    const result = await Service.get<JsonAuth>("/profile", {});

    if (result.isFailure()) {
      return result;
    } else if (Auth.Schema.check(result.value.data)) {
      return new Success(result.value.data);
    } else {
      return new InvalidServerResponseFailure<JsonAuth>(
        result.value,
        "/profile"
      );
    }
  }

  /**
   * Updates the user's profile
   */
  static async updateProfile(update: UpdatableJsonAuthFields) {
    const result = await Service.patch<UpdatableJsonAuthFields, JsonAuth>(
      "/profile",
      update,
      { service: { enableLogoutOnUnauthorized: true } }
    );

    if (result.isFailure()) {
      return result;
    } else if (Auth.Schema.check(result.value.data)) {
      return new Success(result.value.data);
    } else {
      return new InvalidServerResponseFailure<JsonAuth>(
        result.value,
        "/profile"
      );
    }
  }
}
