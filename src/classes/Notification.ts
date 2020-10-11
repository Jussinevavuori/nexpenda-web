import { AlertProps } from "@material-ui/lab";
import { v4 as uuid } from "uuid";

export type NotificationVariant = "error" | "warning" | "success" | "info";

export type NotificationOptions = {
  /**
   * Notification ID, will be auto-generated unless provided
   */
  id: string;

  /**
   * The text to be displayed in the notification.
   */
  message: string;

  /**
   * The timeout in ms for how long the notification
   * should be displayed. Defaults to three seconds.
   */
  timeout: number;

  /**
   * Notification severity
   */
  severity: AlertProps["severity"];

  /**
   * Notification variant
   */
  variant: AlertProps["variant"];

  /**
   * Notification vertical position, defaults to bottom.
   */
  verticalPosition: "top" | "bottom";

  /**
   * Notification horizontal position, defaults to center.
   */
  horizontalPosition: "center" | "left" | "right";

  /**
   * Action for creating an action button
   */
  action: React.ReactNode;
};

export class Notification implements NotificationOptions {
  id: NotificationOptions["id"];
  action: NotificationOptions["action"];
  message: NotificationOptions["message"];
  timeout: NotificationOptions["timeout"];
  variant: NotificationOptions["variant"];
  severity: NotificationOptions["severity"];
  verticalPosition: NotificationOptions["verticalPosition"];
  horizontalPosition: NotificationOptions["horizontalPosition"];

  constructor(options: Partial<NotificationOptions>) {
    this.id = options.id ?? uuid();
    this.action = options.action ?? null;
    this.message = options.message ?? "";
    this.timeout = options.timeout || 3000;
    this.variant = options.variant ?? "standard";
    this.severity = options.severity ?? "info";
    this.verticalPosition = options.verticalPosition ?? "bottom";
    this.horizontalPosition = options.horizontalPosition ?? "center";
  }
}
