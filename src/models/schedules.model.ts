import { Action, action, Thunk, thunk, ThunkOn, thunkOn } from "easy-peasy";
import { Transaction } from "../lib/DataModels/Transaction";
import { TransactionSchedule } from "../lib/DataModels/TransactionSchedule";
import { ScheduleService } from "../services/ScheduleService";
import { StoreModel } from "../store";

export interface SchedulesModel {
  //==============================================================//
  // PROPERTIES
  //==============================================================//

  /**
   * All user's current schedules
   */
  items: TransactionSchedule[];

  /**
   * Has the user loaded the schedules
   */
  initialized: boolean;

  //==============================================================//
  // ACTIONS
  //==============================================================//

  /**
   * Set all schedules to state
   */
  setSchedulesToState: Action<
    SchedulesModel,
    TransactionSchedule | TransactionSchedule[]
  >;

  /**
   * Add multiple schedules to state or if matching schedules by ID already
   * exists in state, change them.
   */
  upsertSchedulesToState: Action<
    SchedulesModel,
    TransactionSchedule | TransactionSchedule[]
  >;

  /**
   * Removes schedules from the state by ID
   */
  removeSchedulesFromStateById: Action<SchedulesModel, string | string[]>;

  /**
   * Clears the state
   */
  clearState: Action<SchedulesModel, void>;

  //==============================================================//
  // THUNKS
  //==============================================================//

  /**
   * Fetch all schedules for user from server
   */
  getSchedules: Thunk<
    SchedulesModel,
    Parameters<typeof ScheduleService["getSchedules"]>[0],
    any,
    StoreModel,
    Promise<
      | undefined
      | PromiseType<ReturnType<typeof ScheduleService["getSchedules"]>>
    >
  >;

  /**
   * Post schedule and update to state
   */
  postSchedule: Thunk<
    SchedulesModel,
    Parameters<typeof ScheduleService["postSchedule"]>[0],
    any,
    StoreModel,
    ReturnType<typeof ScheduleService["postSchedule"]>
  >;

  /**
   * Delete and remove schedule from state
   */
  deleteSchedule: Thunk<
    SchedulesModel,
    Parameters<typeof ScheduleService["deleteSchedule"]>[0],
    any,
    StoreModel,
    ReturnType<typeof ScheduleService["deleteSchedule"]>
  >;

  /**
   * Patch and update schedule to state
   */
  patchSchedule: Thunk<
    SchedulesModel,
    Parameters<typeof ScheduleService["patchSchedule"]>[0],
    any,
    StoreModel,
    ReturnType<typeof ScheduleService["patchSchedule"]>
  >;

  /**
   * Creates all scheduled transactions.
   */
  createScheduledTransactions: Thunk<
    SchedulesModel,
    Parameters<typeof ScheduleService["createScheduledTransactions"]>[0],
    any,
    StoreModel,
    ReturnType<typeof ScheduleService["createScheduledTransactions"]>
  >;

  //==============================================================//
  // LISTENERS
  //==============================================================//

  /**
   * Clear data on logout
   */
  onLogout: ThunkOn<SchedulesModel, any, StoreModel>;
}

export const schedulesModel: SchedulesModel = {
  //==============================================================//
  // PROPERTIES
  //==============================================================//

  items: [],
  initialized: false,

  //==============================================================//
  // ACTIONS
  //==============================================================//

  setSchedulesToState: action((state, payload) => {
    state.items = Array.isArray(payload) ? payload : [payload];
    state.initialized = true;
  }),

  upsertSchedulesToState: action((state, payload) => {
    const schedules = Array.isArray(payload) ? payload : [payload];
    schedules.forEach((schedule) => {
      // Update schedule if one with same ID already exists
      if (state.items.find((_) => _.id === schedule.id)) {
        state.items = state.items.map((_) => {
          return _.id === schedule.id ? schedule : _;
        });
      }
      // Else add schedule if new schedule based on ID
      else {
        state.items.push(schedule);
      }
    });
  }),

  removeSchedulesFromStateById: action((state, payload) => {
    const ids = Array.isArray(payload) ? payload : [payload];
    state.items = state.items.filter((schedule) => !ids.includes(schedule.id));
  }),

  clearState: action((state) => {
    state.items = [];
  }),

  //==============================================================//
  // THUNKS
  //==============================================================//

  getSchedules: thunk(async (actions, payload) => {
    const result = await ScheduleService.getSchedules(payload);

    if (result.isSuccess()) {
      actions.setSchedulesToState(
        result.value.map((json) => new TransactionSchedule(json))
      );
    } else {
      actions.setSchedulesToState([]);
    }
    return result;
  }),

  postSchedule: thunk(async (actions, json) => {
    const result = await ScheduleService.postSchedule(json);
    if (result.isSuccess()) {
      actions.upsertSchedulesToState(new TransactionSchedule(result.value));
    }
    return result;
  }),

  deleteSchedule: thunk(async (actions, payload, { getState }) => {
    // Get schedule and ensure one exists
    const schedule = getState().items.find((_) => _.id === payload.id);

    // Delete the schedule
    actions.removeSchedulesFromStateById(payload.id);
    const result = await ScheduleService.deleteSchedule(payload);

    // If deletion fails, put schedule back
    if (result.isFailure() && schedule) {
      actions.upsertSchedulesToState(schedule);
    }
    return result;
  }),

  patchSchedule: thunk(async (actions, json, store) => {
    const result = await ScheduleService.patchSchedule(json);
    if (result.isSuccess()) {
      const schedule = new TransactionSchedule(result.value);
      actions.upsertSchedulesToState(schedule);
    }
    return result;
  }),

  createScheduledTransactions: thunk(async (actions, payload, store) => {
    const result = await ScheduleService.createScheduledTransactions(payload);
    if (result.isSuccess()) {
      const transactions = result.value.map((json) => new Transaction(json));
      const storeActions = store.getStoreActions();
      storeActions.transactions.upsertTransactionsToState(transactions);
    }
    return result;
  }),

  //==============================================================//
  // LISTENERS
  //==============================================================//

  onLogout: thunkOn(
    (_, store) => store.auth.logout,
    (actions) => {
      actions.clearState();
    }
  ),
};
