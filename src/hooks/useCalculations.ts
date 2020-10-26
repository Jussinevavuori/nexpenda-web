import { useMemo } from "react";
import { MoneyAmount } from "../classes/MoneyAmount";
import { Transaction } from "../classes/Transaction";

/**
 * Calculates a total of all given items.
 */
export function useTotalCalculations(items: Transaction[]) {
  return useMemo(() => {
    const value = items.reduce((sum, item) => {
      return sum + item.amount.value;
    }, 0);

    return new MoneyAmount(value);
  }, [items]);
}
