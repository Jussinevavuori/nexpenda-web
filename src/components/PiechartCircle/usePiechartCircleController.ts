import { useMemo } from "react";
import { PiechartCircleProps } from "./PiechartCircle";

export function usePiechartCircleController(props: PiechartCircleProps) {
  const data = props.data;

  // Get all segments and their absolute and cumulative percentages
  const segments = useMemo(() => {
    const total = data.reduce((sum, item) => {
      return item.amount + sum;
    }, 0);

    const getPercentage = (amount: number) => {
      if (total === 0) return 0;
      return (100 * amount) / total;
    };

    let cumulativePercentage = 0;

    return data.map((item) => {
      const percentage = getPercentage(item.amount);
      cumulativePercentage += percentage;

      return {
        ...item,
        percentage,
        cumulativePercentage: cumulativePercentage - percentage,
      };
    });
  }, [data]);

  // Radius: default to 26
  const radius =
    0.5 * (Math.max(0, props.size ?? 0) || PiechartCircleDefaultSize);

  return {
    radius,
    segments,
  };
}

export const PiechartCircleDefaultSize = 52;
