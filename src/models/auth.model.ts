import { Action, action, Computed, computed, Thunk, thunk } from "easy-peasy";
import { Auth, JsonAuth } from "../classes/Auth";
import { AuthService } from "../services/AuthService";
import { StoreModel } from "../store";

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
   * Action to set the current user with partial user JSON object
   */
  _login: Action<AuthModel, JsonAuth>;

  /**
   * Action to set the current user to null
   */
  _logout: Action<AuthModel, void>;

  /**
   * Function to get the currently logged in user's profile data and apply it
   * to the user property. The logged in property is defined by the current
   * refresh token.
   */
  getProfile: Thunk<
    AuthModel,
    void,
    any,
    StoreModel,
    ReturnType<typeof AuthService["getProfile"]>
  >;

  /**
   * Log in the current user with a Google account
   */
  loginWithGoogle: Thunk<
    AuthModel,
    void,
    any,
    StoreModel,
    ReturnType<typeof AuthService["loginWithGoogle"]>
  >;

  /**
   * Register the current user with email and password
   */
  registerWithEmailPassword: Thunk<
    AuthModel,
    Parameters<typeof AuthService["registerWithEmailAndPassword"]>[0],
    any,
    StoreModel,
    ReturnType<typeof AuthService["registerWithEmailAndPassword"]>
  >;

  /**
   * Log in the current user with email and password
   */
  loginWithEmailPassword: Thunk<
    AuthModel,
    Parameters<typeof AuthService["loginWithEmailAndPassword"]>[0],
    any,
    StoreModel,
    ReturnType<typeof AuthService["loginWithEmailAndPassword"]>
  >;

  /**
   * Forgot password
   */
  forgotPassword: Thunk<
    AuthModel,
    Parameters<typeof AuthService["forgotPassword"]>[0],
    any,
    StoreModel,
    ReturnType<typeof AuthService["forgotPassword"]>
  >;

  /**
   * Log out the current user
   */
  logout: Thunk<
    AuthModel,
    void,
    any,
    StoreModel,
    ReturnType<typeof AuthService["logout"]>
  >;

  /**
   * Validate a change password token
   */
  validateChangePasswordToken: Thunk<
    AuthModel,
    Parameters<typeof AuthService["validatePasswordChangeToken"]>[0],
    any,
    StoreModel,
    ReturnType<typeof AuthService["validatePasswordChangeToken"]>
  >;

  /**
   * Change a user's password
   */
  changePassword: Thunk<
    AuthModel,
    Parameters<typeof AuthService["changePassword"]>[0],
    any,
    StoreModel,
    ReturnType<typeof AuthService["changePassword"]>
  >;

  /**
   * Confirm a user's email
   */
  confirmEmail: Thunk<
    AuthModel,
    Parameters<typeof AuthService["confirmEmail"]>[0],
    any,
    StoreModel,
    ReturnType<typeof AuthService["confirmEmail"]>
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
    if (Auth.isJson(json)) {
      state.user = new Auth(json);
    }
  }),

  _logout: action((state) => {
    state.user = null;
    state.accessToken = null;
  }),

  getProfile: thunk(async (actions, payload) => {
    const profileResult = await AuthService.getProfile();
    profileResult.onSuccess((profile) => {
      actions._login(profile);
    });
    actions._setInitialized(true);
    return profileResult;
  }),

  loginWithGoogle: thunk((actions, payload) => {
    return AuthService.loginWithGoogle();
  }),

  loginWithEmailPassword: thunk(async (actions, payload) => {
    const result = await AuthService.loginWithEmailAndPassword(payload);
    result.onSuccess(async () => {
      const profileResult = await AuthService.getProfile();
      profileResult.onSuccess((profile) => {
        actions._login(profile);
      });
    });
    return result;
  }),

  registerWithEmailPassword: thunk(async (actions, payload) => {
    const result = await AuthService.registerWithEmailAndPassword(payload);
    if (result.isSuccess()) {
      const profileResult = await AuthService.getProfile();
      profileResult.onSuccess((profile) => {
        actions._login(profile);
      });
    }
    return result;
  }),

  forgotPassword: thunk(async (actions, payload) => {
    const result = await AuthService.forgotPassword(payload);
    return result;
  }),

  validateChangePasswordToken: thunk(async (actions, payload) => {
    const result = await AuthService.validatePasswordChangeToken(payload);
    return result;
  }),

  changePassword: thunk(async (actions, payload) => {
    const result = await AuthService.changePassword(payload);
    return result;
  }),

  confirmEmail: thunk(async (actions, payload) => {
    const result = await AuthService.confirmEmail(payload);
    return result;
  }),

  logout: thunk(async (actions, payload) => {
    const result = await AuthService.logout();
    result.onSuccess(() => {
      actions._logout();
    });
    return result;
  }),
};
