export type StripeSessionIdResponse = { sessionId: string };

export type StripeSessionUrlResponse = { url: string };

export class StripeUtils {
  static isStripeSessionIdResponse(_: any): _ is StripeSessionIdResponse {
    return (
      _ &&
      typeof _ === "object" &&
      _.sessionId &&
      typeof _.sessionId === "string"
    );
  }
  static isStripeSessionUrlResponse(_: any): _ is StripeSessionUrlResponse {
    return _ && typeof _ === "object" && _.url && typeof _.url === "string";
  }
}
