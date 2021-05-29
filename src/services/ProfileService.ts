import { Service } from "./Service";
import { Auth, JsonAuth, UpdatableJsonAuthFields } from "../classes/Auth";
import { InvalidServerResponseFailure } from "../result/InvalidServerResponseFailures";
import { Success } from "../result/Success";
import { FileNotUploadedFailure } from "../result/FileFailures";

export class ProfileService extends Service {
  /**
   * Fetches the user's profile if the user is signed in.
   */
  static async getProfile() {
    const result = await Service.get<JsonAuth>("/profile", {}, {});

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

  /**
   * Updates the user's avatar
   *
   * @param imageFileInput When null, will remove the avatar. Otherwise
   * 											 must be provided an input for updating.
   */
  static async updateAvatar(imageFileInput: HTMLInputElement | null) {
    /**
     * Delete avatar if null provided
     */
    if (!imageFileInput) {
      const result = await Service.delete<JsonAuth>("/avatar", {
        service: { enableLogoutOnUnauthorized: true },
      });

      if (result.isFailure()) {
        return result;
      } else if (Auth.Schema.check(result.value.data)) {
        return new Success(result.value.data);
      } else {
        return new InvalidServerResponseFailure<JsonAuth>(
          result.value,
          "/avatar"
        );
      }
    }

    /**
     * Get file from input to form data
     */
    const file = imageFileInput.files?.[0];
    if (!file) {
      return new FileNotUploadedFailure<JsonAuth>();
    }
    const formdata = new FormData();
    formdata.append("file", file);

    /**
     * Post avatar to server
     */
    const result = await Service.post<FormData, JsonAuth>("/avatar", formdata, {
      service: { enableLogoutOnUnauthorized: true },
    });

    if (result.isFailure()) {
      return result;
    } else if (Auth.Schema.check(result.value.data)) {
      return new Success(result.value.data);
    } else {
      return new InvalidServerResponseFailure<JsonAuth>(
        result.value,
        "/avatar"
      );
    }
  }
}
