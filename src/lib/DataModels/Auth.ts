import * as z from "zod";
import { StripeCustomer } from "../Stripe/StripeCustomer";
import { StripeSubscription } from "../Stripe/StripeSubscription";
import { ThemeColors } from "../Theme/ThemeColors";
import { ThemeModes } from "../Theme/ThemeModes";

export type UpdatableJsonAuthFields = {
  displayName?: string | undefined;
  themeColor?: string | undefined;
  themeMode?: string | undefined;
};

export class Auth {
  /**
   * Nexpenda user ID
   */
  id: string;

  /**
   * User's profile display name
   */
  displayName?: string;

  /**
   * User's email address if any
   */
  email?: string;

  /**
   * URL to user's photo if any
   */
  photoUrl?: string;

  /**
   * URL to user's google photo if one provided
   */
  googlePhotoUrl?: string;

  /**
   * The user's Google ID if user has a Google account associated
   */
  googleId?: string;

  /**
   * The user's saved preferred theme color
   */
  themeColor?: ThemeColor | undefined;

  /**
   * The user's saved preferred theme mode
   */
  themeMode?: ThemeMode | undefined;

  /**
   * Is the user an admin or not?
   */
  isAdmin: boolean;

  /**
   * Is the user a premium user or not?
   */
  isPremium: boolean;

  /**
   * Does the user have a password or not?
   */
  hasPassword?: boolean;

  /**
   * The user's stripe customer object if any
   */
  customer: StripeCustomer | undefined;

  /**
   * The user's stripe subscriptions if any
   */
  subscriptions: StripeSubscription[];

  constructor(json: JsonAuth) {
    this.id = json.id;
    this.displayName = json.displayName ?? undefined;
    this.email = json.email ?? undefined;
    this.photoUrl = json.photoUrl ?? undefined;
    this.googlePhotoUrl = json.googlePhotoUrl ?? undefined;
    this.googleId = json.googleId ?? undefined;
    this.isAdmin = !!json.isAdmin;
    this.isPremium = !!json.isPremium;
    this.hasPassword = json.hasPassword;

    this.customer = json.customer
      ? new StripeCustomer(json.customer)
      : undefined;

    this.subscriptions = (json.subscriptions ?? []).map(
      (jsonSub) => new StripeSubscription(jsonSub)
    );

    if (ThemeColors.isThemeColor(json.themeColor)) {
      this.themeColor = json.themeColor;
    }
    if (ThemeModes.isThemeMode(json.themeMode)) {
      this.themeMode = json.themeMode;
    }
  }

  /**
   * Gets the user's 2 first initials
   */
  get initials() {
    return (this.displayName ?? this.email ?? "")
      .split(/[^a-zA-Z]/g)
      .filter(Boolean)
      .slice(0, 2)
      .map((_) => _.charAt(0))
      .map((_) => _.toUpperCase())
      .join("");
  }

  // ===========================================================================
  // SCHEMAS
  // ===========================================================================

  /**
   * Schema of json Auth objects
   */
  static Schema = z.object({
    id: z.string().min(1),
    displayName: z.string().optional(),
    photoUrl: z.string().optional(),
    googlePhotoUrl: z.string().optional(),
    email: z.string().optional(),
    googleId: z.string().optional(),
    isAdmin: z.boolean().optional(),
    isPremium: z.boolean().optional(),
    themeColor: z.enum(ThemeColors.themeColors).optional(),
    themeMode: z.enum(ThemeModes.themeModes).optional(),
    prefersColorScheme: z.string().optional(),
    hasPassword: z.boolean().optional(),
    customer: StripeCustomer.Schema.optional(),
    subscriptions: z.array(StripeSubscription.Schema).optional(),
  });
}
