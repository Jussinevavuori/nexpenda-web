import "./TransactionSpreadsheetReadSheetResult.scss";
import React from "react";
import cx from "classnames";
import { useTransactionSpreadsheetReadSheetResultController } from "./useTransactionSpreadsheetReadSheetResultController";
import { SpreadsheetReadSheetResult } from "../../utils/FileIO/Spreadsheet";
import { Type } from "../Type/Type";

export type TransactionSpreadsheetReadSheetResultProps = {
	data: SpreadsheetReadSheetResult<JsonSpreadsheetTransaction>
	maxRowsCount?: number;
};

export function TransactionSpreadsheetReadSheetResult(props: TransactionSpreadsheetReadSheetResultProps) {

	const controller = useTransactionSpreadsheetReadSheetResultController(props)

	return <div className={cx("TransactionSpreadsheetReadSheetResult")}>
		{
			controller.shownRows.length === 0
				? <Type>
					{"No transactions found on this sheet."}
				</Type>
				: <>
					<div className="tableContainer">
						<table>
							<thead>
								<tr>
									<td>
										<Type variant="bold">
											{"Date"}
										</Type>
									</td>
									<td>
										<Type variant="bold">
											{"Amount"}
										</Type>
									</td>
									<td>

										<Type variant="bold">
											{"Category"}
										</Type>
									</td>
									<td>
										<Type variant="bold">
											{"Comment"}
										</Type>
									</td>
								</tr>
							</thead>

							<tbody>
								{controller.shownRows.map((row, i) => (
									<tr key={i}>
										<td>
											<Type className={row.time ? "time" : "time empty"}>
												{new Date(row.time).toLocaleDateString()}
											</Type>
										</td>
										<td>
											<Type className={row.integerAmount ? "amount" : "amount empty"}>
												{(row.integerAmount / 100).toFixed(2) + " €"}
											</Type>
										</td>
										<td>
											<Type className={row.category ? "category" : "category empty"}>
												{row.category || "No category"}
											</Type>
										</td>
										<td>
											<Type className={row.comment ? "comment" : "comment empty"}>
												{row.comment || "No comment"}
											</Type>
										</td>
									</tr>
								))}
							</tbody>

						</table>
					</div>
					<Type className="footer">
						{`Showing ${controller.shownRows.length} / ${props.data.succeeded} rows`}
					</Type>
				</>
		}

	</div>
}