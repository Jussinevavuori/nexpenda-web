import { action, Action, Computed, computed, thunk, Thunk } from "easy-peasy";
import { HistoryEvent } from "../history/HistoryEvent";
import { EventNotFoundFailure } from "../result/Failures";

export type HistoryModel = {
  //==============================================================//
  // PROPERTIES
  //==============================================================//

  maxSize: number;

  history: HistoryEvent<any>[];

  //==============================================================//
  // COMPUTED PROPERTIES
  //==============================================================//

  latest: Computed<HistoryModel, HistoryEvent<any> | undefined>;

  //==============================================================//
  // ACTIONS
  //==============================================================//

  pushEvent: Action<HistoryModel, HistoryEvent<any>>;

  removeEvent: Action<HistoryModel, string>;

  //==============================================================//
  // THUNKS
  //==============================================================//

  restoreEvent: Thunk<HistoryModel, string>;
};

export const historyModel: HistoryModel = {
  //==============================================================//
  // PROPERTIES
  //==============================================================//

  maxSize: 100,
  history: [],

  //==============================================================//
  // COMPUTED PROPERTIES
  //==============================================================//

  latest: computed((state) => {
    if (state.history.length === 0) {
      return undefined;
    } else {
      return state.history[state.history.length - 1];
    }
  }),

  //==============================================================//
  // ACTIONS
  //==============================================================//

  pushEvent: action((state, event) => {
    if (state.history.length === state.maxSize) {
      state.history.shift();
    }
    state.history.push(event);
  }),

  removeEvent: action((state, eventId) => {
    state.history = state.history.filter((_) => _.id !== eventId);
  }),

  //==============================================================//
  // THUNKS
  //==============================================================//

  restoreEvent: thunk((actions, eventId, { getState }) => {
    const history = getState().history;
    const event = history.find((_) => _.id === eventId);
    if (event) {
      const result = event.restore();
      actions.removeEvent(event.id);
      return result;
    } else {
      return new EventNotFoundFailure();
    }
  }),
};
