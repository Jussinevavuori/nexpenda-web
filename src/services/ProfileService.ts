import { Service } from "./Service";
import { Auth } from "../classes/Auth";
import { InvalidServerResponseFailure } from "../result/Failures";
import { Success } from "../result/Success";
import { FileNotUploadedFailure } from "../result/Failures";

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
  static async updateAvatar(target: HTMLInputElement | null | string) {
    /**
     * Delete avatar if no target provided
     */
    if (!target) {
      const result = await Service.delete<JsonAuth>(
        "/avatar",
        {},
        { service: { enableLogoutOnUnauthorized: true } }
      );

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
     * Attempt directly update photo URL via a PUT request when a string is
     * provided as target.
     */
    if (typeof target === "string") {
      const result = await Service.put<{ url: string }, JsonAuth>(
        "/avatar",
        { url: target },
        { service: { enableLogoutOnUnauthorized: true } }
      );

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
     * Get file from input to form data by default.
     */
    const file = target.files?.[0];
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
