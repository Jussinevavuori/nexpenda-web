import { store } from "../../store";

/**
 * Enables exposing values to the window in development / admin user mode.
 *
 * @param object Values to expose to the window object
 * 							 with their corresponding keys.
 */
export function exposeToWindow<T extends {}>(object: T) {
  if (
    process.env.NODE_ENV === "development" ||
    store.getState().auth.user?.isAdmin
  ) {
    for (const [key, value] of Object.entries(object)) {
      (window as any)[key] = value;
    }
  }
}
