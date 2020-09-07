import { Action, action, Computed, computed, Thunk, thunk } from "easy-peasy";
import { Auth } from "./auth.class";
import { AuthService } from "../../services/AuthService";
import { JsonAuth, isJsonAuth } from "./auth.json";
import { StoreInjections, StoreModel } from "../../store";

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
   * Action to set the current user with partial user data (a constructable)
   */
  _login: Action<AuthModel, JsonAuth>;

  /**
   * Function to get the currently logged in user's profile data and apply it
   * to the user property. The logged in property is defined by the current
   * refresh token.
   */
  getProfile: Thunk<
    AuthModel,
    void,
    StoreInjections,
    StoreModel,
    ReturnType<AuthService["getProfile"]>
  >;

  /**
   * Log in the current user with a Google account
   */
  loginWithGoogle: Thunk<
    AuthModel,
    void,
    StoreInjections,
    StoreModel,
    ReturnType<AuthService["loginWithGoogle"]>
  >;

  /**
   * Register the current user with email and password
   */
  registerWithEmailPassword: Thunk<
    AuthModel,
    { email: string; password: string },
    StoreInjections,
    StoreModel,
    ReturnType<AuthService["registerWithEmailAndPassword"]>
  >;

  /**
   * Log in the current user with email and password
   */
  loginWithEmailPassword: Thunk<
    AuthModel,
    { email: string; password: string },
    StoreInjections,
    StoreModel,
    ReturnType<AuthService["loginWithEmailAndPassword"]>
  >;

  /**
   * Forgot password
   */
  forgotPassword: Thunk<
    AuthModel,
    { email: string },
    StoreInjections,
    StoreModel,
    ReturnType<AuthService["forgotPassword"]>
  >;

  /**
   * Log out the current user
   */
  logout: Thunk<
    AuthModel,
    void,
    StoreInjections,
    StoreModel,
    ReturnType<AuthService["logout"]>
  >;
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

  _login: action((state, json) => {
    if (isJsonAuth(json)) {
      state.user = new Auth(json);
    }
  }),

  getProfile: thunk(async (actions, payload, { injections }) => {
    const profileResult = await injections.authService.getProfile();
    profileResult.onSuccess((profile) => {
      actions._login(profile);
    });
    actions._setInitialized(true);
    return profileResult;
  }),

  loginWithGoogle: thunk((actions, payload, { injections }) => {
    return injections.authService.loginWithGoogle();
  }),

  loginWithEmailPassword: thunk(async (actions, payload, { injections }) => {
    const result = await injections.authService.loginWithEmailAndPassword(
      payload
    );
    result.onSuccess(async () => {
      const profileResult = await injections.authService.getProfile();
      profileResult.onSuccess((profile) => {
        actions._login(profile);
      });
    });
    return result;
  }),

  registerWithEmailPassword: thunk(async (actions, payload, { injections }) => {
    const result = await injections.authService.registerWithEmailAndPassword(
      payload
    );
    result.onSuccess(async () => {
      const profileResult = await injections.authService.getProfile();
      profileResult.onSuccess((profile) => {
        actions._login(profile);
      });
    });
    return result;
  }),

  forgotPassword: thunk(async (actions, payload, { injections }) => {
    const forgotPasswordResult = await injections.authService.forgotPassword(
      payload
    );
    return forgotPasswordResult;
  }),

  logout: thunk((actions, payload, { injections }) => {
    return injections.authService.logout();
  }),
};
