import { useCallback } from "react";
import { useHistory } from "react-router-dom";
import { useScheduleCreatorOpenState } from "../../hooks/componentStates/useScheduleCreatorOpenState";
import { SchedulesProps } from "./Schedules";

export function useSchedulesController(props: SchedulesProps) {
  const history = useHistory();

  const navigateBack = useCallback(() => history.goBack(), [history]);
  const { handleOpen: handleCreate } = useScheduleCreatorOpenState();

  return {
    navigateBack,
    handleCreate,
  };
}
