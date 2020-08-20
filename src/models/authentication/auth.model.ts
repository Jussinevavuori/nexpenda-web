import { Action, action, Computed, computed, Thunk, thunk } from "easy-peasy";
import { User } from "./user.class";
// import { isUserConstructable } from "./user.constructable";
// import jwt from "jsonwebtoken";
import { AuthService } from "../../services/AuthService";
import { isUserConstructable, UserConstructable } from "./user.constructable";

/**
 * An instance of the auth service for the authentication model to use
 */
export const authService = new AuthService();

/**
 * Defining the current user, access token and user functions
 */
export interface AuthenticationModel {
  /**
   * Has the application automatically fetched the current user's profile?
   */
  loading: boolean;

  /**
   * Function to mark as initialized
   */
  setLoading: Action<AuthenticationModel, boolean>;

  /**
   * Currently loggged in user or null if none logged in
   */
  user: User | null;

  /**
   * Computed property for whether the user is currently logged in
   */
  isLoggedIn: Computed<AuthenticationModel, boolean>;

  /**
   * Action to set the current user with partial user data (a constructable)
   */
  applyUserConstructable: Action<AuthenticationModel, UserConstructable>;

  /**
   * Current access token for authentication in memory for security purposes.
   * This is automatically refreshed when making a request with a service and
   * should not be manually set.
   */
  accessToken: string | null;

  /**
   * Function to set the access token
   */
  setAccessToken: Action<AuthenticationModel, string>;

  /**
   * Function to get the currently logged in user's profile data and apply it
   * to the user property. The logged in property is defined by the current
   * refresh token.
   */
  getProfile: Thunk<AuthenticationModel, void>;

  /**
   * Log in the current user with a Google account
   */
  logInWithGoogle: Thunk<AuthenticationModel, void>;

  /**
   * Log out the current user
   */
  logOut: Thunk<AuthenticationModel, void>;
}

/**
 * Implementation of the authentication model
 */
export const authenticationModel: AuthenticationModel = {
  loading: true,

  setLoading: action((state) => {
    state.loading = false;
  }),

  user: null,

  isLoggedIn: computed((state) => Boolean(state.user)),

  applyUserConstructable: action((state, constructable) => {
    state.user = new User(constructable);
  }),

  accessToken: null,

  setAccessToken: action((state, newAccessToken) => {
    state.accessToken = newAccessToken;
  }),

  getProfile: thunk(async (actions) => {
    try {
      const result = await authService.getProfile();
      if (isUserConstructable(result.data)) {
        actions.applyUserConstructable(result.data);
      }
    } catch (error) {
      console.warn("Not logged in");
    } finally {
      actions.setLoading(false);
    }
  }),

  logInWithGoogle: thunk(() => {
    authService.logInWithGoogle();
  }),

  logOut: thunk(() => {
    authService.logOut();
  }),
};
