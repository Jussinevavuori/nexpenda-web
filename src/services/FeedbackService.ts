import { Service } from "./Service";

export class FeedbackService extends Service {
  /**
   * Post a feedback
   */
  static async postFeedback(message: string) {
    const result = await Service.post(
      "/feedback",
      { message },
      { service: { enableLogoutOnUnauthorized: true } }
    );

    return Service.validateResult(result, null, { status: 200 });
  }
}
