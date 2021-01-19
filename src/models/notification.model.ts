import { action, Action } from "easy-peasy";
import { Notification, NotificationOptions } from "../classes/Notification";

export type NotificationModel = {
  //==============================================================//
  // PROPERTIES
  //==============================================================//

  /**
   * All notifications in state
   */
  notifications: Notification[];

  //==============================================================//
  // ACTIONS
  //==============================================================//

  /**
   * Create a new notification and add it to the state
   */
  notify: Action<NotificationModel, Partial<NotificationOptions>>;

  /**
   * Delete a notification from the state
   */
  deleteNotification: Action<NotificationModel, string>;
};

export const notificationModel: NotificationModel = {
  //==============================================================//
  // PROPERTIES
  //==============================================================//

  notifications: [],

  //==============================================================//
  // ACTIONS
  //==============================================================//

  notify: action((state, options) => {
    const notification = new Notification(options);
    state.notifications.push(notification);
  }),

  deleteNotification: action((state, id) => {
    state.notifications = state.notifications.filter((_) => _.id !== id);
  }),
};
