import { useCallback, useMemo } from "react";
import { useAvatarChangerDialogOpenState } from "../../hooks/componentStates/useAvatarChangerDialogOpenState";
import { useOpenStateWrapper } from "../../hooks/state/useOpenStateWrapper";
import { useStoreActions, useStoreState } from "../../store";
import { AvatarChangerMenuProps } from "./AvatarChangerMenu";

export function useAvatarChangerMenuController(props: AvatarChangerMenuProps) {
  const user = useStoreState((_) => _.auth.user);
  const updateAvatar = useStoreActions((_) => _.auth.updateAvatar);

  const avatarChangerDialog = useOpenStateWrapper(
    useAvatarChangerDialogOpenState()
  );

  const handleClose = useCallback(() => {
    props.onClose?.({}, "backdropClick");
  }, [props]);

  const handleSelectUpload = useCallback(() => {
    handleClose();
    avatarChangerDialog.handleOpen();
  }, [handleClose, avatarChangerDialog]);

  const disableRemove = useMemo(() => !user?.photoUrl, [user]);

  const handleSelectRemove = useCallback(() => {
    if (disableRemove) return;
    updateAvatar(null);
    handleClose();
  }, [handleClose, disableRemove, updateAvatar]);

  return {
    handleClose,
    disableRemove,
    handleSelectRemove,
    handleSelectUpload,
  };
}
