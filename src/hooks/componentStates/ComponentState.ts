/**
 * Contains utilities for custom component open state hooks.
 */
export class ComponentState {
  /**
   * All keys for component states used either in the hash or the
   * query string.
   */
  static keys = {
    AvatarChangerMenu: "avatarmenu",
    AvatarChanger: "avatar",
    BudgetMenu: "budget-menu",
    BudgetCreator: "budget-create",
    BudgetEditor: "budget-edit",
    EmojiPicker: "emoji",
    FeedbackDialog: "feedback",
    FileUploader: "upload",
    FreemiumTracker: "free",
    IntervalManager: "i",
    LocketOutDialog: "getpremium",
    ScheduleForm: "schedule",
    TransactionCreator: "transaction-create",
    TransactionEditor: "transaction-edit",
    UserMenu: "usermenu",
    Calculator: "calc",
  };
}
