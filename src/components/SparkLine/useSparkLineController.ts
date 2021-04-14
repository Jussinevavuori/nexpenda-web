import { useMemo } from "react";
import { SparkLineProps } from "./SparkLine";

export function useSparkLineController(props: SparkLineProps) {
  const data = props.data;

  // Calculate viewbox height
  const aspectRatio = props.aspectRatio ?? SparkLineDefaultAspectRatio;
  const viewBoxHeight = SparkLineDefaultViewBoxWidth / aspectRatio;

  const sortedData = useMemo(() => {
    return data.sort((a, b) => {
      return a.x - b.x;
    });
  }, [data]);

  return {
    sortedData,
    strokeWidth: props.strokeWidth ?? SparkLineDefaultStrokeWidth,
    viewBox: {
      width: SparkLineDefaultViewBoxWidth,
      height: viewBoxHeight,
    },
  };
}

export const SparkLineDefaultViewBoxWidth = 100;
export const SparkLineDefaultAspectRatio = 2.0;
export const SparkLineDefaultStrokeWidth = 0.8;
