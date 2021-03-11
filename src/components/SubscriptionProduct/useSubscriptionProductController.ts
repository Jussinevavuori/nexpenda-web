import { MoneyAmount } from "../../classes/MoneyAmount";
import { useStoreState } from "../../store";
import { SubscriptionProductProps } from "./SubscriptionProduct";

export function useSubscriptionProductController(
  props: SubscriptionProductProps
) {
  const products = useStoreState((_) => _.stripe.products);

  const product = products.find((_) => _.data.name === "Nexpenda Premium");

  const price = product?.data.prices.find(
    (_) => _.recurring.interval === props.variant
  );

  const priceMoneyAmount = price
    ? new MoneyAmount(price.unit_amount)
    : undefined;

  return {
    product: product?.data,
    price,
    priceMoneyAmount,
  };
}
