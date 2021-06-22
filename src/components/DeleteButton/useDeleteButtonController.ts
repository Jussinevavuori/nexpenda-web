import { useCallback, useEffect, useRef, useState } from "react";
import { useMountedRef } from "../../hooks/utils/useMountedRef";
import { DeleteButtonProps } from "./DeleteButton";

export function useDeleteButtonController(props: DeleteButtonProps) {
  const {
    onConfirm,
    activeTimeoutMs,
    deleteLabel,
    confirmLabel,
    deletingLabel,
    ...EnhancedButtonProps
  } = props;

  const isMounted = useMountedRef();

  const [isDeleting, setIsDeleting] = useState(false);
  const [isActivated, setIsActivated] = useState(false);

  const timeout = useRef<number | null>(null);

  const setDeactivateTimeout = useCallback(() => {
    timeout.current = window.setTimeout(() => {
      if (isMounted.current) setIsActivated(false);
    }, activeTimeoutMs ?? 5000);
  }, [timeout, isMounted, setIsActivated, activeTimeoutMs]);

  const clearTimeout = useCallback(() => {
    if (!timeout.current) return;
    window.clearTimeout(timeout.current);
  }, [timeout]);

  /**
   * On click: On first click, activate. On second click, confirm if activation
   * timeout not expired.
   */
  const onClick = useCallback(async () => {
    // Activate
    if (!isActivated) {
      setIsActivated(true);
      setDeactivateTimeout();
      return;
    }

    // Clear timeout
    clearTimeout();

    // Start deleting and confirmation
    setIsDeleting(true);
    await onConfirm?.();

    // Reset state
    setIsActivated(false);
    setIsDeleting(false);
  }, [
    setDeactivateTimeout,
    clearTimeout,
    onConfirm,
    setIsDeleting,
    setIsActivated,
    isActivated,
  ]);

  /**
   * Cleanup timeouts
   */
  useEffect(() => {
    return () => {
      clearTimeout();
    };
  }, [clearTimeout]);

  return {
    isActivated,
    EnhancedButtonProps,
    onClick,
    isDeleting,
  };
}
