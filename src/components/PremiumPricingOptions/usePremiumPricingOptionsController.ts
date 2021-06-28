import { PremiumPricingOptionsProps } from "./PremiumPricingOptions";
import { useStoreActions, useStoreState } from "../../store";
import { useMemo } from "react";
import { PremiumPrice } from "../../lib/DataModels/PremiumPrice";

export function usePremiumPricingOptionsController(
  props: PremiumPricingOptionsProps
) {
  const createCheckoutSession = useStoreActions(
    (_) => _.stripe.createCheckoutSession
  );
  const prices = useStoreState((_) => _.premiumPrices.items);

  const sortedPrices = useMemo(() => {
    return prices.sort(PremiumPrice.createPriceComparison("ASC"));
  }, [prices]);

  function getOnSubscribeHandler(price: PremiumPrice) {
    return () => {
      createCheckoutSession(price.id);
    };
  }

  return {
    prices: sortedPrices,
    getOnSubscribeHandler,
  };
}
