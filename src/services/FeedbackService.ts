import { Service } from "./Service";
import { Success } from "../lib/Result/Success";
import { InvalidServerResponseFailure } from "../lib/Result/Failures";

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

    if (result.isFailure()) {
      return result;
    } else if (result.value.status === 200) {
      return Success.Empty();
    } else {
      return new InvalidServerResponseFailure<void>(
        result.value,
        "feedback/post"
      );
    }
  }
}
