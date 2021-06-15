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
    AvatarChangerDialog: "avatar",
    BudgetBlockMenu: "budget",
    BudgetCreatorDialog: "budget",
    BudgetEditorDialog: "budget",
    FeedbackDialog: "feedback",
    FileUploaderDrawer: "uploadfile",
    FreemiumTrackerDialog: "freemium",
    IntervalMenu: "interval",
    LocketOutDialog: "buypremium",
    TransactionCreatorDrawer: "create",
    TransactionEditorDrawer: "edit",
    Search: "search",
    SubscriptionCanceled: "subscription-canceled",
    UserMenu: "usermenu",
    Calculator: "calc",
  };
}
