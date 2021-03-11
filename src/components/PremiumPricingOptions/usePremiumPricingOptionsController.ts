import { PremiumPricingOptionsProps } from "./PremiumPricingOptions";
import { useStoreActions, useStoreState } from "../../store";

export function usePremiumPricingOptionsController(
  props: PremiumPricingOptionsProps
) {
  const createCheckoutSession = useStoreActions(
    (_) => _.stripe.createCheckoutSession
  );
  const products = useStoreState((_) => _.stripe.products);
  const product = products[0];

  const percentageYearlyCheaperThanMonthly = (() => {
    if (!product) return "0%";
    if (!product.monthlyPrice || !product.yearlyPrice) return "0%";
    const m = product.monthlyPrice.unit_amount * 12;
    const y = product.yearlyPrice.unit_amount;

    return ((100 * (m - y)) / m).toFixed(0) + "%";
  })();

  function getOnSubscribeHandler(variant: "yearly" | "monthly") {
    return () => {
      const priceId =
        variant === "yearly"
          ? product.yearlyPrice?.id
          : product.monthlyPrice?.id;

      if (!priceId) return;

      createCheckoutSession(priceId);
    };
  }

  return {
    product,
    percentageYearlyCheaperThanMonthly,
    getOnSubscribeHandler,
  };
}
