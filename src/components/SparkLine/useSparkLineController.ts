import { useMemo } from "react";
import { SvgPath } from "../../utils/GeometryUtils/SvgPath";
import { SparkLineProps } from "./SparkLine";

export function useSparkLineController(props: SparkLineProps) {
  const data = props.data;

  // Calculate viewbox height
  const aspectRatio = props.aspectRatio ?? SparkLineDefaults.AspectRatio;
  const viewBoxHeight = SparkLineDefaults.ViewBoxWidth / aspectRatio;

  const strokeWidth = props.strokeWidth ?? SparkLineDefaults.StrokeWidth;

  const zerolineStrokeWidth =
    props.zerolineStrokeWidth ?? SparkLineDefaults.ZeroLineStrokeWidth;

  const verticalPadding =
    props.verticalPadding ?? SparkLineDefaults.VerticalPadding;

  const viewBox = useMemo(() => {
    return {
      width: SparkLineDefaults.ViewBoxWidth,
      height: viewBoxHeight,
    };
  }, [viewBoxHeight]);

  const sortedData = useMemo(() => {
    return data.sort((a, b) => {
      return a.x - b.x;
    });
  }, [data]);

  const svgPath = useMemo(
    () =>
      SvgPath.describeSparkLine({
        data: sortedData,
        height: viewBox.height,
        width: viewBox.width,
        strokeWidth: strokeWidth,
        verticalPadding: verticalPadding,
      }),
    [sortedData, viewBox, strokeWidth, verticalPadding]
  );

  return { svgPath, strokeWidth, zerolineStrokeWidth, viewBox };
}

export const SparkLineDefaults = {
  ViewBoxWidth: 100,
  AspectRatio: 2.0,
  StrokeWidth: 0.5,
  ZeroLineStrokeWidth: 0.4,
  VerticalPadding: 2,
  GradientStops: [
    { percentage: 0, opacity: 1 },
    { percentage: 95, opacity: 0 },
  ],
};
