import { action, Action } from "easy-peasy";
import { Notification, NotificationOptions } from "../classes/Notification";

export type NotificationModel = {
  notifications: Notification[];
  notify: Action<NotificationModel, Partial<NotificationOptions>>;
  deleteNotification: Action<NotificationModel, string>;
};

export const notificationModel: NotificationModel = {
  notifications: [],

  notify: action((state, options) => {
    const notification = new Notification(options);
    state.notifications.push(notification);
  }),

  deleteNotification: action((state, id) => {
    state.notifications = state.notifications.filter((_) => _.id !== id);
  }),
};
