import { UploadFileButtonProps } from "./UploadFileButton";

export function useUploadFileButtonController(props: UploadFileButtonProps) {
  const { onChange, ...ButtonProps } = props;

  return {
    ButtonProps,
  };
}
