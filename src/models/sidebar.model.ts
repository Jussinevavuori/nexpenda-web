import { Action, action } from "easy-peasy";
import { StorageService } from "../services/StorageService";

export interface SidebarModel {
  isOpen: boolean;
  toggle: Action<SidebarModel, void>;
}

export const sidebarModel: SidebarModel = {
  isOpen: !StorageService.isSidebarClosed.getValue(),
  toggle: action((state) => {
    const target = !state.isOpen;
    StorageService.isSidebarClosed.setValue(!target);
    state.isOpen = target;
  }),
};
