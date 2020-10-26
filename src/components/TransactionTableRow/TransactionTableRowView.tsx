import "./TransactionTableRow.scss";
import React from "react"
import { Transaction } from "../../classes/Transaction";
import { format } from "date-fns";
import { MoneyType } from "../MoneyType/MoneyType";
import { Type } from "../Type/Type";
import { IconButton } from "@material-ui/core";
import {
	Label as LabelIcon,
	CheckBox as SelectedIcon,
	CheckBoxOutlineBlank as UnselectedIcon,
} from "@material-ui/icons"
import { HslColor } from "../../utils/ColorUtils/Color";

export type TransactionTableRowViewProps = {
	transaction: Transaction;

	onSelectCategory(): void;

	onClick(e: React.MouseEvent): void;
	onContextMenu(e: React.MouseEvent<HTMLElement>): void;

	selected: boolean;
	onSelect(): void;
	onDeselect(): void;
	selectionActive: boolean;
}

export function TransactionTableRowView(props: TransactionTableRowViewProps) {

	/**
	 * Generate a random color to use as the label color for the category.
	 */
	const color = HslColor.getRandomColorFromString(
		props.transaction.category,
		{
			lightness: 48,
			saturation: 58,
		}
	)

	return <div
		className="TransactionTableRow"
		onClick={props.onClick}
		onContextMenu={props.onContextMenu}
	>
		<div className="action">
			{
				props.selectionActive
					? props.selected
						? <IconButton
							onClick={e => {
								e.stopPropagation()
								props.onDeselect()
							}}
							children={<SelectedIcon />}
						/>
						: <IconButton
							onClick={(e) => {
								e.stopPropagation()
								props.onSelect()
							}}
							children={<UnselectedIcon />}
						/>
					: <IconButton
						onClick={(e) => {
							e.stopPropagation()
							props.onSelectCategory()
						}}
					>
						<LabelIcon style={{ color: color.toHexString() }} />
					</IconButton>
			}
		</div>
		<div className="category">
			<Type variant="subtitle2">
				{props.transaction.category}
			</Type>
		</div>
		<div className="amount">
			<MoneyType
				amount={props.transaction.amount}
				applyColor
				bold
			/>
		</div>
		<div className="comment">
			<Type variant="body2">
				{props.transaction.comment}
			</Type>
		</div>
		<div className="date">
			<Type variant="subtitle2">
				{toDatestring(props.transaction.date)}
			</Type>
		</div>
	</div>
}

function toDatestring(date: Date) {
	return date.getFullYear() === currentYear
		? format(date, "d.M.")
		: format(date, "d.M.yyyy")
}

const currentYear = new Date().getFullYear()