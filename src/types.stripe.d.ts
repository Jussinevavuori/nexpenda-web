type JsonStripeProduct = import("zod").TypeOf<
  typeof import("./classes/StripeProduct").StripeProduct["Schema"]
>;
type JsonStripePrice = import("zod").TypeOf<
  typeof import("./classes/StripePrice").StripePrice["Schema"]
>;
type JsonStripeSubscriptionItem = import("zod").TypeOf<
  typeof import("./classes/StripeSubscriptionItem").StripeSubscriptionItem["Schema"]
>;
type JsonStripeCustomer = import("zod").TypeOf<
  typeof import("./classes/StripeCustomer").StripeCustomer["Schema"]
>;
type JsonStripeCoupon = import("zod").TypeOf<
  typeof import("./classes/StripeCoupon").StripeCoupon["Schema"]
>;
type JsonStripeDiscount = import("zod").TypeOf<
  typeof import("./classes/StripeDiscount").StripeDiscount["Schema"]
>;
type JsonStripeSubscription = import("zod").TypeOf<
  typeof import("./classes/StripeSubscription").StripeSubscription["Schema"]
>;

type JsonStripeSubscriptionStatus = JsonStripeSubscription["status"];
type JsonStripePriceRecurring = JsonStripePrice["recurring"];
