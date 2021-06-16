import { Action, action } from "easy-peasy";

// NOTE:
// This model does not contain the search term and processed smart search
// filter which are used to filter transactions. That state is kept near the
// transactions in the transactions model.

export interface SearchModel {
  isOpen: boolean;
  setOpen: Action<SearchModel, boolean>;
}

export const searchModel: SearchModel = {
  isOpen: false,
  setOpen: action((state, payload) => {
    state.isOpen = payload;
  }),
};
