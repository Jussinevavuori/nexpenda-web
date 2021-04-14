import { Category } from "../../classes/Category";
import { Transaction } from "../../classes/Transaction";
import { calculateAnalyticsAllTime } from "./calculateAnalyticsAllTime";
import { calculateAnalyticsPastYear } from "./calculateAnalyticsPastYear";
import { calculateAnalyticsSelected } from "./calculateAnalyticsSelected";
import { differenceInDays, subDays, subMilliseconds } from "date-fns";

export type CalculateAnalyticsArguments = {
  transactions: Transaction[];
  categories: Category[];
  interval: {
    start: Date;
    end: Date;
  };
};

export function calculateAnalytics(args: CalculateAnalyticsArguments) {
  // Calculate previous interval
  const diff = differenceInDays(args.interval.end, args.interval.start);
  const prevInterval = {
    start: subDays(args.interval.start, diff + 1),
    end: subMilliseconds(args.interval.start, 1),
  };

  return {
    allTime: calculateAnalyticsAllTime(args),
    selected: calculateAnalyticsSelected(args),
    pastYear: calculateAnalyticsPastYear(args),
    previous: calculateAnalyticsSelected({
      ...args,
      interval: prevInterval,
    }),
    selectedInterval: args.interval,
    previousInterval: prevInterval,
  };
}
