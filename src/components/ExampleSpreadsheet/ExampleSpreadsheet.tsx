import "./ExampleSpreadsheet.scss";
import React from "react";
import cx from "classnames";
// import { useExampleSpreadsheetController } from "./useExampleSpreadsheetController";
import { Type } from "../Type/Type";
import { Tooltip } from "@material-ui/core";
import { TransactionSpreadsheet } from "../../lib/FileIO/TransactionSpreadsheet";

export type ExampleSpreadsheetProps = {

};

export function ExampleSpreadsheet(props: ExampleSpreadsheetProps) {

	// const controller = useExampleSpreadsheetController(props)

	return <table className={cx("ExampleSpreadsheet")} >
		<thead>
			<tr>
				<Tooltip
					title={<div className="ExampleSpreadsheet__tooltip">
						<Type variant="bold">
							{"This column can have any of the following names:"}
						</Type>
						<ul>
							{TransactionSpreadsheet.options.time.names.map(
								(name, i) => <Type component="li" key={i} children={name} />
							)}
						</ul>
					</div>}
				>
					<td>
						<Type variant="bold">
							{"Date"}
						</Type>
					</td>
				</Tooltip>

				<Tooltip
					title={<div className="ExampleSpreadsheet__tooltip">
						<Type variant="bold">
							{"This column can have any of the following names:"}
						</Type>
						<ul>
							{TransactionSpreadsheet.options.integerAmount.names.map(
								(name, i) => <Type component="li" key={i} children={name} />
							)}
						</ul>
					</div>}
				>
					<td>
						<Type variant="bold">
							{"Amount"}
						</Type>
					</td>
				</Tooltip>

				<Tooltip
					title={<div className="ExampleSpreadsheet__tooltip">
						<Type variant="bold">
							{"This column can have any of the following names:"}
						</Type>
						<ul>
							{TransactionSpreadsheet.options.category.names.map(
								(name, i) => <Type component="li" key={i} children={name} />
							)}
						</ul>
					</div>
					}
				>
					<td>

						<Type variant="bold">
							{"Category"}
						</Type>
					</td>
				</Tooltip>


				<Tooltip
					title={<div className="ExampleSpreadsheet__tooltip">
						<Type variant="bold">
							{"(Optional) "}
							{"This column can have any of the following names:"}
						</Type>
						<ul>
							{TransactionSpreadsheet.options.comment.names.map(
								(name, i) => <Type component="li" key={i} children={name} />
							)}
						</ul>
					</div>}
				>
					<td>
						<Type variant="bold">
							{"Comment"}
						</Type>
					</td>
				</Tooltip>
			</tr>
		</thead>


		<tbody>
			<tr>
				<td>
					<Type>
						{"1.1.2020"}
					</Type>
				</td>
				<td>
					<Type>
						{"-49.00 €"}
					</Type>
				</td>
				<td>
					<Type>
						{"Food"}
					</Type>
				</td>
				<td>
					<Type>
						{"Groceries"}
					</Type>
				</td>
			</tr>
			<tr>
				<td>
					<Type>
						{"2.1.2020"}
					</Type>
				</td>
				<td>
					<Type>
						{"-20.00 €"}
					</Type>
				</td>
				<td>
					<Type>
						{"Utilities"}
					</Type>
				</td>
				<td>
					<Type>
						{"Electric bill"}
					</Type>
				</td>
			</tr>
			<tr>
				<td>
					<Type center>
						{"..."}
					</Type>
				</td>
				<td>
					<Type center>
						{"..."}
					</Type>
				</td>
				<td>
					<Type center>
						{"..."}
					</Type>
				</td>
				<td>
					<Type center>
						{"..."}
					</Type>
				</td>
			</tr>
		</tbody>
	</table>
}