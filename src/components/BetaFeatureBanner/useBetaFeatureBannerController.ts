import { useState } from "react";
import { StorageService } from "../../services/StorageService";
import { BetaFeatureBannerProps } from "./BetaFeatureBanner";

export function useBetaFeatureBannerController(props: BetaFeatureBannerProps) {
  const [isDismissed, setIsDismissed] = useState(
    StorageService.hasDismissedBetaFeatureBanner(props.feature).getValue()
  );

  function handleDismiss() {
    setIsDismissed(true);
    StorageService.hasDismissedBetaFeatureBanner(props.feature).setValue(true);
  }

  return { handleDismiss, isDismissed };
}
