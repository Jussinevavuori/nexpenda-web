import "./ActiveFilters.scss";
import React from "react"
import { Chip } from "@material-ui/core";
import {
	Search as SearchTermIcon,
	Category as CategoryIcon,
	Payment as AmountIcon,
} from "@material-ui/icons";
import { MoneyAmount } from "../../classes/MoneyAmount";

export type ActiveFiltersViewProps = {

	searchTermFilter: string;
	categoryFilter: string[];
	minAmountFilter: number;
	maxAmountFilter: number;

	searchTermFilterActive: boolean;
	categoryFilterActive: boolean;
	minAmountFilterActive: boolean;
	maxAmountFilterActive: boolean;

	onResetSearchTermFilter(): void;
	onResetCategoryFilter(): void;
	onResetAmountFilter(): void;

}

export function ActiveFiltersView(props: ActiveFiltersViewProps) {

	const minAmount = new MoneyAmount(props.minAmountFilter)
	const maxAmount = new MoneyAmount(props.maxAmountFilter)

	return <div className="ActiveFilters">

		{
			props.searchTermFilterActive ? <Chip
				className="activeFilterChip searchTerm"
				icon={<SearchTermIcon />}
				label={`"${props.searchTermFilter}"`}
				onDelete={props.onResetSearchTermFilter}
				variant="outlined"
			/> : null
		}

		{
			props.categoryFilterActive ? <Chip
				className="activeFilterChip category"
				icon={<CategoryIcon />}
				label={(() => {
					if (props.categoryFilter.length > 2) {
						return `${props.categoryFilter.length} categories`
					}
					return props.categoryFilter.join(", ")
				})()}
				onDelete={props.onResetCategoryFilter}
				variant="outlined"
			/> : null
		}

		{
			props.minAmountFilterActive || props.maxAmountFilterActive ? <Chip
				className="activeFilterChip amount"
				icon={<AmountIcon />}
				label={(() => {
					if (props.minAmountFilterActive && props.maxAmountFilterActive) {
						return `Between ${minAmount.format()} and ${maxAmount.format()}`
					} else if (props.minAmountFilterActive) {
						return `${minAmount.format()} or more`
					} else if (props.maxAmountFilterActive) {
						return `${maxAmount.format()} or less`
					} else {
						return ""
					}
				})()}
				onDelete={props.onResetAmountFilter}
				variant="outlined"
			/> : null
		}

	</div>

}