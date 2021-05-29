import { useState } from "react";
import { useFeedbackDialogOpenState } from "../../hooks/componentStates/useFeedbackDialogOpenState";
import { FeedbackService } from "../../services/FeedbackService";
import { useStoreActions } from "../../store";
import { FeedbackDialogProps } from "./FeedbackDialog";

export function useFeedbackDialogController(props: FeedbackDialogProps) {
  const notify = useStoreActions((_) => _.notification.notify);

  const [isOpen, setIsOpen] = useFeedbackDialogOpenState();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(e?: React.MouseEvent | React.FormEvent) {
    if (e) {
      e.preventDefault();
    }

    if (!message) {
      return;
    }

    setIsLoading(true);
    const result = await FeedbackService.postFeedback(message);
    if (result.isSuccess()) {
      notify({
        message: "Thank you for your feedback! ❤",
        severity: "success",
      });
    } else {
      notify({
        message: "Could not send feedback.",
        severity: "error",
      });
    }
    setMessage("");
    setIsOpen(false);
    setIsLoading(false);
  }

  return {
    handleClose() {
      setIsOpen(false);
    },
    isOpen,
    isLoading,
    message,
    setMessage,
    handleSubmit,
  };
}
