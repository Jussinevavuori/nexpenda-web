import { Action, action, Computed, computed, Thunk, thunk } from "easy-peasy";
import { INITIAL_TIMESTAMP } from "..";
import { Auth, JsonAuth } from "../classes/Auth";
import { AuthService } from "../services/AuthService";
import { ProfileService } from "../services/ProfileService";
import { StoreModel } from "../store";

export interface AuthModel {
  //==============================================================//
  // PROPERTIES
  //==============================================================//

  /**
   * Currently logged in user or null if none logged in
   */
  user: Auth | null;

  /**
   * Initialized state: has the profile been fetched at the least once
   */
  initialized: boolean;

  /**
   * Current access token for authentication in memory for security purposes.
   * This is automatically refreshed when making a request with a service and
   * should not be manually set.
   */
  accessToken: string | null;

  //==============================================================//
  // COMPUTED PROPERTIES
  //==============================================================//

  /**
   * Computed property for whether the user is currently logged in
   */
  isLoggedIn: Computed<AuthModel, boolean>;

  //==============================================================//
  // ACTIONS
  //==============================================================//

  /**
   * Sets the initialized state
   */
  setInitialized: Action<AuthModel, boolean>;

  /**
   * Sets the access token
   */
  setAccessToken: Action<AuthModel, string>;

  /**
   * Sets the current user with partial user JSON object
   */
  setAuthToState: Action<AuthModel, JsonAuth>;

  /**
   * Action to set the current user to null
   */
  clearState: Action<AuthModel, void>;

  //==============================================================//
  // THUNKS
  //==============================================================//

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
    ReturnType<typeof ProfileService["getProfile"]>
  >;

  /**
   * Function to partially update the profile
   */
  updateProfile: Thunk<
    AuthModel,
    Parameters<typeof ProfileService["updateProfile"]>[0],
    any,
    StoreModel,
    ReturnType<typeof ProfileService["updateProfile"]>
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

  /**
   * Request a new confirmation email for user
   */
  requestConfirmationEmail: Thunk<
    AuthModel,
    Parameters<typeof AuthService["requestConfirmationEmail"]>[0],
    any,
    StoreModel,
    ReturnType<typeof AuthService["requestConfirmationEmail"]>
  >;
}

/**
 * Implementation of the authentication model
 */
export const authModel: AuthModel = {
  //==============================================================//
  // PROPERTIES
  //==============================================================//

  initialized: false,
  user: null,
  accessToken: null,

  //==============================================================//
  // COMPUTED PROPERTIES
  //==============================================================//

  isLoggedIn: computed((state) => Boolean(state.user)),

  //==============================================================//
  // ACTIONS
  //==============================================================//

  setInitialized: action((state, boolean) => {
    state.initialized = boolean;
  }),

  setAccessToken: action((state, newAccessToken) => {
    state.accessToken = newAccessToken;
  }),

  setAuthToState: action((state, json) => {
    if (Auth.Schema.check(json)) {
      state.user = new Auth(json);
      const now = new Date().getTime();
      console.log(`Profile loaded at ${now - INITIAL_TIMESTAMP} ms`);
    }
  }),

  clearState: action((state) => {
    state.user = null;
    state.accessToken = null;
  }),

  //==============================================================//
  // THUNKS
  //==============================================================//

  getProfile: thunk(async (actions, payload) => {
    const profile = await ProfileService.getProfile();
    if (profile.isSuccess()) {
      actions.setAuthToState(profile.value);
    }
    actions.setInitialized(true);
    return profile;
  }),

  updateProfile: thunk(async (actions, payload) => {
    const profile = await ProfileService.updateProfile(payload);
    if (profile.isSuccess()) {
      actions.setAuthToState(profile.value);
    }
    return profile;
  }),

  loginWithGoogle: thunk((actions, payload) => {
    return AuthService.loginWithGoogle();
  }),

  loginWithEmailPassword: thunk(async (actions, payload) => {
    const result = await AuthService.loginWithEmailAndPassword(payload);
    if (result.isSuccess()) {
      const profile = await ProfileService.getProfile();
      if (profile.isSuccess()) {
        actions.setAuthToState(profile.value);
      }
    }
    return result;
  }),

  registerWithEmailPassword: thunk(async (actions, payload) => {
    const result = await AuthService.registerWithEmailAndPassword(payload);
    if (result.isSuccess()) {
      const profile = await ProfileService.getProfile();
      if (profile.isSuccess()) {
        actions.setAuthToState(profile.value);
      }
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

  requestConfirmationEmail: thunk(async (actions, payload) => {
    const result = await AuthService.requestConfirmationEmail(payload);
    return result;
  }),

  logout: thunk(async (actions, payload) => {
    const result = await AuthService.logout();
    if (result.isSuccess()) {
      actions.clearState();
    }
    return result;
  }),
};
