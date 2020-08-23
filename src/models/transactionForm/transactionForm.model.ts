import { Action, action } from "easy-peasy";

export type TransactionFormModel = {
  isOpen: boolean;

  setOpen: Action<TransactionFormModel, boolean>;

  open: Action<TransactionFormModel, void>;

  close: Action<TransactionFormModel, void>;
};

export const transactionFormModel: TransactionFormModel = {
  isOpen: false,

  setOpen: action((state, boolean) => {
    state.isOpen = boolean;
  }),

  open: action((state) => {
    state.isOpen = true;
  }),

  close: action((state) => {
    state.isOpen = false;
  }),
};
