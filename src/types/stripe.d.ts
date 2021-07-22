/**
 * JSON Stripe product schema type
 */
type JsonStripeProduct = import("zod").TypeOf<
  typeof import("../lib/Stripe/StripeProduct").StripeProduct["Schema"]
>;

/**
 * JSON Stripe price schema type
 */
type JsonStripePrice = import("zod").TypeOf<
  typeof import("../lib/Stripe/StripePrice").StripePrice["Schema"]
>;

/**
 * JSON Stripe subscription item schema type
 */
type JsonStripeSubscriptionItem = import("zod").TypeOf<
  typeof import("../lib/Stripe/StripeSubscriptionItem").StripeSubscriptionItem["Schema"]
>;

/**
 * JSON Stripe customer schema type
 */
type JsonStripeCustomer = import("zod").TypeOf<
  typeof import("../lib/Stripe/StripeCustomer").StripeCustomer["Schema"]
>;

/**
 * JSON Stripe coupon schema type
 */
type JsonStripeCoupon = import("zod").TypeOf<
  typeof import("../lib/Stripe/StripeCoupon").StripeCoupon["Schema"]
>;

/**
 * JSON Stripe discount schema type
 */
type JsonStripeDiscount = import("zod").TypeOf<
  typeof import("../lib/Stripe/StripeDiscount").StripeDiscount["Schema"]
>;

/**
 * JSON Stripe subscription schema type
 */
type JsonStripeSubscription = import("zod").TypeOf<
  typeof import("../lib/Stripe/StripeSubscription").StripeSubscription["Schema"]
>;

/**
 * Possible statuses of a stripe subscription
 */
type JsonStripeSubscriptionStatus = JsonStripeSubscription["status"];

/**
 * Possible recurrences of a stripe subscription
 */
type JsonStripePriceRecurring = JsonStripePrice["recurring"];
