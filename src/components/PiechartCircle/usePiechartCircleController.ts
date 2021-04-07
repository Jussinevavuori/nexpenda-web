import { useMemo } from "react";
import { PiechartCircleProps } from "./PiechartCircle";

export function usePiechartCircleController(props: PiechartCircleProps) {
  const data = props.data;

  // Get all segments and their absolute and cumulative percentages
  const segments = useMemo(() => {
    const total = data.reduce((s, i) => i.amount + s, 0);

    const getPercentage = (amount: number) => {
      if (total === 0) return 0;
      return (100 * amount) / total;
    };

    let cumulativePercentage = 0;

    return data.map((item) => {
      const percentage = getPercentage(item.amount);

      const value = {
        ...item,
        percentage,
        cumulativePercentage: cumulativePercentage,
      };

      cumulativePercentage += percentage;

      return value;
    });
  }, [data]);

  // Radius: default to 26
  const radius =
    0.5 * (Math.max(0, props.size ?? 0) || PiechartCircleDefaultSize);

  const stroke = props.stroke ?? PiechartCircleDefaultStroke;

  return {
    radius,
    stroke,
    segments,
  };
}

export const PiechartCircleDefaultSize = 52;
export const PiechartCircleDefaultStroke = 4;
