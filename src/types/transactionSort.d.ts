/**
 * List of properties which transactions can be sorted by
 */
type TransactionSortableProperty = "amount" | "date" | "category" | "comment";

/**
 * Potential directions of a sort
 */
type TransactionSortableDirection = "ascending" | "descending";

/**
 * List of properties combined with directions which transactions
 * can be sorted by
 */
type RequiredTransactionSortStrategy =
  `${TransactionSortableProperty}-${TransactionSortableDirection}`;

/**
 * List of properties combined with directions which transactions
 * can be sorted by including "none" for no sorting
 */
type TransactionSortStrategy = "none" | RequiredTransactionSortStrategy;
