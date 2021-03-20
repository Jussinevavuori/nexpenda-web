import { TransactionSpreadsheetReadSheetResultProps } from "./TransactionSpreadsheetReadSheetResult";

export function useTransactionSpreadsheetReadSheetResultController(
  props: TransactionSpreadsheetReadSheetResultProps
) {
  const shownRows = props.data.rows
    .slice(0, props.maxRowsCount ?? 10)
    .filter(Boolean);

  return {
    shownRows,
  };
}
