type JsonStripeProduct = {
  id: string;
  object: "product";
  active: boolean;
  attributes: any[];
  created: number;
  description: string | null;
  images: any[];
  livemode: boolean;
  metadata: any;
  name: string;
  statement_descriptor: any;
  type: string;
  unit_label: string | null;
  updated: number;
  prices: JsonStripePrice[];
};

type JsonStripePriceRecurrence = {
  aggretage_usage: any;
  interval: string;
  trial_period_days: number | null;
  usage_type: string;
  interval_count: number;
};

type JsonStripePrice = {
  id: string;
  object: "price";
  active: boolean;
  billing_scheme: string;
  created: number;
  currency: string;
  livemode: boolean;
  lookup_key: any;
  metadata: any;
  nickname: string | null;
  product: string;
  tiers_mode: any;
  transform_quantity: number | null;
  type: string;
  unit_amount: number;
  unit_amount_decimal: string;
  recurring: JsonStripePriceRecurrence;
};

type JsonStripeSubscriptionItem = {
  id: string;
  metadata: any;
  price: JsonStripePrice;
  quantity: number;
  subscription: string;
  object: "subscription_item";
  billing_thresholds: any;
  created: number;
  tax_rates: any[];
};

type JsonStripeCustomer = {
  id: string;
  object: "customer";
};

type JsonStripeSubscriptionStatus =
  | "incomplete"
  | "incomplete_expired"
  | "trialing"
  | "active"
  | "past_due"
  | "canceled"
  | "unpaid";

type JsonStripeCoupon = {
  id: string;
  object: "coupon";
  amount_off: number | null;
  created: number;
  currency: string | null;
  duration: "once" | "repeating" | "forever";
  duration_in_months: null | number;
  metadata: any;
  name: string;
  percent_off: number | null;
  applies_to: any;
  livemode: boolean;
  max_redemptions: number | null;
  redeem_by: number | null;
  times_redeemed: number | null;
  valid: boolean;
};

type JsonStripeDiscount = {
  id: string;
  object: "discount";
  checkout_session: string | null;
  coupon: JsonStripeCoupon;
  customer: string;
  end: null | number;
  start: null | number;
  invoice: string | null;
  invoice_item: string | null;
  promotion_code: string | null;
};

type JsonStripeSubscription = {
  id: string;
  items: JsonStripeSubscriptionItem[];
  object: "subscription";
  status: JsonStripeSubscriptionStatus;
  cancel_at: number | null;
  canceled_at: number | null;
  cancel_at_period_end: boolean;
  collection_method: "charge_automatically" | "send_invoice";
  created: number;
  current_period_end: number;
  current_period_start: number;
  days_until_due: number | null;
  discount: JsonStripeDiscount | null;
  ended_at: number | null;
  start_date: number;
  metadata: any;
};
