import { useCallback, useMemo } from "react";
import { useAvatarChangerDialogOpenState } from "../../hooks/componentStates/useAvatarChangerDialogOpenState";
import { useOpenStateWrapper } from "../../hooks/state/useOpenStateWrapper";
import { useStoreActions, useStoreState } from "../../store";
import { AvatarChangerMenuProps } from "./AvatarChangerMenu";

export function useAvatarChangerMenuController(props: AvatarChangerMenuProps) {
  const user = useStoreState((_) => _.auth.user);
  const updateAvatar = useStoreActions((_) => _.auth.updateAvatar);
  const notify = useStoreActions((_) => _.notification.notify);

  // Open state

  const avatarChangerDialog = useOpenStateWrapper(
    useAvatarChangerDialogOpenState()
  );

  // Closing

  const handleClose = useCallback(() => {
    props.onClose?.({}, "backdropClick");
  }, [props]);

  // Uploading

  const handleSelectUpload = useCallback(() => {
    handleClose();
    avatarChangerDialog.handleOpen();
  }, [handleClose, avatarChangerDialog]);

  // Removing

  const disableRemove = useMemo(() => !user?.photoUrl, [user]);

  const handleSelectRemove = useCallback(async () => {
    if (disableRemove) return;
    const result = await updateAvatar(null);
    if (result.isSuccess()) {
      notify({ message: "Succesfully removed avatar.", severity: "success" });
    } else {
      notify({ message: "Failed to remove avatar.", severity: "warning" });
    }
    handleClose();
  }, [handleClose, disableRemove, updateAvatar, notify]);

  // Resetting to google photo url

  const canReset = useMemo(() => !!user?.googlePhotoUrl, [user]);

  const disableReset = useMemo(
    () => !user?.googlePhotoUrl || user.googlePhotoUrl === user.photoUrl,
    [user]
  );

  const handleSelectReset = useCallback(async () => {
    if (disableReset || !user?.googlePhotoUrl) return;
    const result = await updateAvatar(user.googlePhotoUrl);
    if (result.isSuccess()) {
      notify({ message: "Succesfully resetted avatar.", severity: "success" });
    } else {
      notify({ message: "Failed to reset avatar.", severity: "warning" });
    }
    handleClose();
  }, [handleClose, disableReset, updateAvatar, notify, user]);

  return {
    handleClose,
    disableRemove,
    handleSelectRemove,
    handleSelectUpload,
    canReset,
    disableReset,
    handleSelectReset,
  };
}
