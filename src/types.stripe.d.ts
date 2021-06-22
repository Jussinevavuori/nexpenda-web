type JsonStripeProduct = import("zod").TypeOf<
  typeof import("./lib/Stripe/StripeProduct").StripeProduct["Schema"]
>;
type JsonStripePrice = import("zod").TypeOf<
  typeof import("./lib/Stripe/StripePrice").StripePrice["Schema"]
>;
type JsonStripeSubscriptionItem = import("zod").TypeOf<
  typeof import("./lib/Stripe/StripeSubscriptionItem").StripeSubscriptionItem["Schema"]
>;
type JsonStripeCustomer = import("zod").TypeOf<
  typeof import("./lib/Stripe/StripeCustomer").StripeCustomer["Schema"]
>;
type JsonStripeCoupon = import("zod").TypeOf<
  typeof import("./lib/Stripe/StripeCoupon").StripeCoupon["Schema"]
>;
type JsonStripeDiscount = import("zod").TypeOf<
  typeof import("./lib/Stripe/StripeDiscount").StripeDiscount["Schema"]
>;
type JsonStripeSubscription = import("zod").TypeOf<
  typeof import("./lib/Stripe/StripeSubscription").StripeSubscription["Schema"]
>;

type JsonStripeSubscriptionStatus = JsonStripeSubscription["status"];
type JsonStripePriceRecurring = JsonStripePrice["recurring"];
