import { Category } from "../../classes/Category";
import { Transaction } from "../../classes/Transaction";
import { calculateAnalyticsAllTime } from "./calculateAnalyticsAllTime";
import { calculateAnalyticsPastYear } from "./calculateAnalyticsPastYear";
import { calculateAnalyticsSelected } from "./calculateAnalyticsSelected";

export type CalculateAnalyticsArguments = {
  transactions: Transaction[];
  categories: Category[];
  interval: {
    start: Date;
    end: Date;
  };
};

export function calculateAnalytics(args: CalculateAnalyticsArguments) {
  return {
    allTime: calculateAnalyticsAllTime(args),
    selected: calculateAnalyticsSelected(args),
    pastYear: calculateAnalyticsPastYear(args),
  };
}
