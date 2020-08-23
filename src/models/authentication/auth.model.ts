import { Action, action, Computed, computed, Thunk, thunk } from "easy-peasy";
import { Auth } from "./auth.class";
import { AuthService } from "../../services/AuthService";
import { JsonAuth, isJsonAuth } from "./auth.json";
import { isServerError, ServerError } from "../../utils/ServerError";

/**
 * An instance of the auth service for the authentication model to use
 */
export const authService = new AuthService();

export interface AuthModel {
  /**
   * Initialized state: has the profile been fetched at the least once
   */
  initialized: boolean;
  _setInitialized: Action<AuthModel, boolean>;

  /**
   * Currently logged in user or null if none logged in
   */
  user: Auth | null;

  /**
   * Computed property for whether the user is currently logged in
   */
  isLoggedIn: Computed<AuthModel, boolean>;

  /**
   * Current access token for authentication in memory for security purposes.
   * This is automatically refreshed when making a request with a service and
   * should not be manually set.
   */
  accessToken: string | null;

  /**
   * Function to set the access token
   */
  _setAccessToken: Action<AuthModel, string>;

  /**
   * Function to get the currently logged in user's profile data and apply it
   * to the user property. The logged in property is defined by the current
   * refresh token.
   */
  getProfile: Thunk<AuthModel, void, any, any, Promise<void | ServerError>>;

  /**
   * Log in the current user with a Google account
   */
  loginWithGoogle: Thunk<AuthModel, void>;

  /**
   * Register the current user with email and password
   */
  registerWithEmailPassword: Thunk<
    AuthModel,
    { email: string; password: string },
    any,
    any,
    Promise<void | ServerError>
  >;

  /**
   * Log in the current user with email and password
   */
  loginWithEmailPassword: Thunk<
    AuthModel,
    { email: string; password: string },
    any,
    any,
    Promise<void | ServerError>
  >;

  /**
   * Action to set the current user with partial user data (a constructable)
   */
  _login: Action<AuthModel, JsonAuth>;

  /**
   * Log out the current user
   */
  logout: Thunk<AuthModel, void>;
}

/**
 * Implementation of the authentication model
 */
export const authModel: AuthModel = {
  initialized: false,
  _setInitialized: action((state, boolean) => {
    state.initialized = boolean;
  }),

  user: null,

  isLoggedIn: computed((state) => Boolean(state.user)),

  accessToken: null,

  _setAccessToken: action((state, newAccessToken) => {
    state.accessToken = newAccessToken;
  }),

  getProfile: thunk(async (actions) => {
    const { data } = await authService.getProfile();
    if (isServerError(data)) {
      actions._setInitialized(true);
      return data;
    } else if (data) {
      actions._login(data);
    }
    actions._setInitialized(true);
  }),

  loginWithGoogle: thunk(() => {
    authService.loginWithGoogle();
  }),

  loginWithEmailPassword: thunk(async (actions, form) => {
    const { data } = await authService.loginWithEmailAndPassword(form);
    if (isServerError(data)) {
      return data;
    } else if (data) {
      const { data: profileData } = await authService.getProfile();
      if (!profileData || isServerError(profileData)) return;
      actions._login(profileData);
    }
  }),

  registerWithEmailPassword: thunk(async (actions, form) => {
    const { data } = await authService.registerWithEmailAndPassword(form);
    if (isServerError(data)) {
      return data;
    } else if (data) {
      const { data: profileData } = await authService.getProfile();
      if (!profileData || isServerError(profileData)) return;
      actions._login(profileData);
    }
  }),

  _login: action((state, json) => {
    if (isJsonAuth(json)) {
      state.user = new Auth(json);
    }
  }),

  logout: thunk(() => {
    authService.logout();
  }),
};
