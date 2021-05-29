import { useMemo, useRef, useState } from "react";
import { useStoreActions } from "../../store";
import { AvatarChangerProps } from "./AvatarChanger";

export function useAvatarChangerController(props: AvatarChangerProps) {
  const notify = useStoreActions((_) => _.notification.notify);
  const updateAvatar = useStoreActions((_) => _.auth.updateAvatar);

  // Get ref to input
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Store uploaded file in state
  const [file, setFile] = useState<File>();

  // Get URL to file for preview purposes
  const fileUrl = useMemo(
    () => (file ? URL.createObjectURL(file) : ""),
    [file]
  );

  // Current error message if any
  const [error, setError] = useState<string>();

  // Is the user currently submitting the image
  const [submitting, setSubmitting] = useState(false);

  // Handle change by updating file
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setError("");
    const targetFile = e.target.files?.[0];
    setFile(targetFile);
  }

  // Handle cancel current image
  function handleCancel() {
    setError("");
    setFile(undefined);
  }

  // Handle submit by uploading file
  async function handleSubmit() {
    setError("");
    if (!inputRef.current) {
      return;
    }
    setSubmitting(true);
    const result = await updateAvatar(inputRef.current);
    setSubmitting(false);
    if (result.isSuccess()) {
      notify({
        message: "Avatar succesfully changed",
        severity: "success",
      });
      props.onSubmitted?.();
    } else {
      setError(() => {
        switch (result.reason) {
          case "file-not-uploaded":
            return "You have not uploaded an image";
          case "network":
            switch (result.code) {
              case "request/too-many-requests":
                return "You are trying too fast. Try again later.";
              case "file/too-large":
                return "File is too large. Try again with a smaller file.";
              default:
                return "Updating avatar failed. Try again later.";
            }
          default:
            return "Updating avatar failed. Try again later.";
        }
      });
    }
  }

  return {
    submitting,
    error,
    inputRef,
    file,
    fileUrl,
    handleCancel,
    handleSubmit,
    handleChange,
  };
}
