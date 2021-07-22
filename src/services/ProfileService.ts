import { Service } from "./Service";
import { Auth } from "../lib/DataModels/Auth";
import { FileNotUploadedFailure } from "../lib/Result/Failures";

export class ProfileService extends Service {
  /**
   * Fetches the user's profile if the user is signed in.
   */
  static async getProfile() {
    const result = await Service.get<JsonAuth>("/profile", {}, {});
    return Service.validateResult(result, Auth.Schema);
  }

  /**
   * Updates the user's profile
   */
  static async updateProfile(update: AuthUpdater) {
    const result = await Service.patch<AuthUpdater, JsonAuth>(
      "/profile",
      update,
      { service: { enableLogoutOnUnauthorized: true } }
    );

    return Service.validateResult(result, Auth.Schema);
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

      return Service.validateResult(result, Auth.Schema);
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

      return Service.validateResult(result, Auth.Schema);
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

    return Service.validateResult(result, Auth.Schema);
  }
}
