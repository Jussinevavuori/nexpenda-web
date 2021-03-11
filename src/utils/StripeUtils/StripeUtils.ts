export type StripeSessionIdResponse = { sessionId: string };

export class StripeUtils {
  static isStripeSessionIdResponse(val: any): val is StripeSessionIdResponse {
    return (
      val &&
      typeof val === "object" &&
      val.sessionId &&
      typeof val.sessionId === "string"
    );
  }
}
