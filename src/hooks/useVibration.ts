import { useCallback } from "react";

type VibrationStrength = "default" | "weak" | "strong";

const patterns: Record<VibrationStrength, number[]> = {
  weak: [10],
  default: [100],
  strong: [200],
};

export function useVibration() {
  const handleVibrate = useCallback(
    (strength: VibrationStrength = "default") => {
      const pattern = patterns[strength];
      window.navigator.vibrate(pattern);
    },
    []
  );

  return handleVibrate;
}
