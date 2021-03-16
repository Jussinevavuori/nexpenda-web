import { useRef } from "react";
import { PercentageCircleProps } from "./PercentageCircle";

export function usePercentageCircleController(props: PercentageCircleProps) {
  const activeRef = useRef<SVGPathElement | null>(null);

  // Limit percentage to non-negative numbers.
  const percentage = Math.max(0, props.percentage);

  // Get fill percentage
  const fillPercentage = Math.min(percentage, 100);

  // Radius: default to 20
  const radius =
    0.5 * (Math.max(0, props.size ?? 0) || PercentageCircleDefaultSize);

  const isOverflow = percentage >= 100;

  return {
    radius,
    percentage,
    fillPercentage,
    isOverflow,

    activeRef,
  };
}

export const PercentageCircleDefaultSize = 52;
