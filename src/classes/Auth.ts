import * as z from "zod";
import { ThemeUtils } from "../utils/ThemeUtils/ThemeUtils";
import { StripeCustomer } from "./StripeCustomer";
import { StripeSubscription } from "./StripeSubscription";

export type JsonAuth = {
  id: string;
  displayName: string | undefined;
  photoUrl: string | undefined;
  email: string | undefined;
  googleId: string | undefined;
  themeColor?: string | undefined;
  themeMode?: string | undefined;
  isAdmin?: boolean;
  isPremium?: boolean;

  customer?: JsonStripeCustomer;
  subscriptions?: JsonStripeSubscription[];
};

export type UpdatableJsonAuthFields = {
  displayName?: string | undefined;
  photoUrl?: string | undefined;
  themeColor?: string | undefined;
  themeMode?: string | undefined;
};

export class Auth {
  id: string;
  displayName?: string;
  email?: string;
  photoUrl?: string;
  googleId?: string;
  themeColor?: ThemeColor | undefined;
  themeMode?: ThemeMode | undefined;
  isAdmin: boolean;
  isPremium: boolean;

  customer: StripeCustomer | undefined;
  subscriptions: StripeSubscription[];

  constructor(json: JsonAuth) {
    this.id = json.id;
    this.displayName = json.displayName ?? undefined;
    this.email = json.email ?? undefined;
    this.photoUrl = json.photoUrl ?? undefined;
    this.googleId = json.googleId ?? undefined;
    this.isAdmin = !!json.isAdmin;
    this.isPremium = !!json.isPremium;

    this.customer = json.customer
      ? new StripeCustomer(json.customer)
      : undefined;

    this.subscriptions = (json.subscriptions ?? []).map(
      (jsonSub) => new StripeSubscription(jsonSub)
    );

    if (ThemeUtils.isThemeColor(json.themeColor)) {
      this.themeColor = json.themeColor;
    }
    if (ThemeUtils.isThemeMode(json.themeMode)) {
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

  /**
   * Schema of json Auth objects
   */
  static Schema = z.object({
    id: z.string().min(1),
    displayName: z.string().optional(),
    photoUrl: z.string().optional(),
    email: z.string().optional(),
    googleId: z.string().optional(),
    isAdmin: z.boolean().optional(),
    isPremium: z.boolean().optional(),
    prefersColorScheme: z.string().optional(),
    customer: StripeCustomer.Schema.optional(),
    subscriptions: z.array(StripeSubscription.Schema).optional(),
  });
}
