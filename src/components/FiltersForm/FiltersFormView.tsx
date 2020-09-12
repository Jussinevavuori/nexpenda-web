import "./FiltersForm.scss";
import React from "react"
import { Sort as FiltersIcon, Clear as ClearIcon } from "@material-ui/icons";
import { Button, TextField, InputAdornment, IconButton, Slider, Chip } from "@material-ui/core";
import { Type } from "../Type/Type";

export type FiltersFormViewProps = {

	onConfirm?(): void;

	onResetAll(): void;

	onResetSearchTerm(): void;
	onResetAmount(): void;
	onResetExcludedCategories(): void;

	categories: string[];

	searchTerm: string;
	minAmount: number;
	maxAmount: number;
	excludedCategories: string[];

	setSearchTerm(value: string): void;
	setAmount(values: [number | undefined, number | undefined]): void;
	excludeCategory(value: string | string[]): void;
	includeCategory(value: string): void;

	minPossibleAmount: number;
	maxPossibleAmount: number;

}

export function FiltersFormView(props: FiltersFormViewProps) {
	return <div className="FiltersForm">

		<header>

			<div className="title">
				<Type variant="button">
					{"Filters"}
				</Type>
				<FiltersIcon />
			</div>

			<Button
				variant="text"
				onClick={props.onResetAll}
			>
				{"Reset all"}
			</Button>

		</header>

		<section className="searchTerm">

			<div className="sectionLabel">

				<Type className="label">
					{"Search term"}
				</Type>

			</div>

			<TextField
				value={props.searchTerm}
				onChange={e => props.setSearchTerm(e.target.value)}
				variant="outlined"
				size="small"
				fullWidth
				InputProps={{
					endAdornment: <InputAdornment position="end">
						<IconButton size="small" onClick={props.onResetSearchTerm}>
							<ClearIcon />
						</IconButton>
					</InputAdornment>
				}}
			/>

		</section>

		<section className="amount">

			<div className="sectionLabel">

				<Type className="label">
					{"Amount"}
				</Type>

				<Button
					variant="text"
					onClick={props.onResetAmount}
				>
					{"Reset"}
				</Button>

			</div>

			<div className="sliderLabel">
				<Type>
					{
						props.minAmount <= props.minPossibleAmount
							? "N/A"
							: Math.floor(props.minAmount / 100) + " €"
					}
				</Type>
				<Type>
					{
						props.maxAmount >= props.maxPossibleAmount
							? "N/A"
							: Math.ceil(props.maxAmount / 100) + " €"
					}
				</Type>
			</div>

			<div className="sliderContainer">

				<Slider
					value={[Math.floor(props.minAmount / 100), Math.ceil(props.maxAmount / 100)]}
					onChange={(e, value) => Array.isArray(value) && value.length === 2
						? props.setAmount(value.map(_ => _ * 100) as [number, number])
						: console.error("Slider returned value which is not a numeric tuple:", value)
					}
					step={1}
					min={Math.floor(props.minPossibleAmount / 100)}
					max={Math.ceil(props.maxPossibleAmount / 100)}
					marks={[{ value: 0, label: "0" }]}
					valueLabelDisplay="off"
				/>

			</div>

		</section>

		<section className="category">

			<div className="sectionLabel">

				<Type className="label">
					{"Categories"}
				</Type>

				<Button
					variant="text"
					onClick={props.onResetExcludedCategories}
				>
					{"Reset"}
				</Button>

			</div>

			<div className="categoryChips">

				{props.categories.map(category => {
					const excluded = props.excludedCategories.includes(category)
					return <Chip
						onClick={() => {
							if (excluded) { props.includeCategory(category) }
							else { props.excludeCategory(category) }
						}}
						color={excluded ? "default" : "primary"}
						label={category}
					/>
				})}

			</div>

			<div className="categoryActions">

				<Button
					variant="text"
					onClick={props.onResetExcludedCategories}
				>
					{"Select all"}
				</Button>

				<Button
					variant="text"
					onClick={() => props.excludeCategory(props.categories)}
				>
					{"Deselect all"}
				</Button>

			</div>



		</section>

		{
			props.onConfirm === undefined ? null :
				<section className="ok">
					<Button
						color="primary"
						variant="contained"
						onClick={props.onConfirm}
						fullWidth
					>
						{"Ok"}
					</Button>
				</section>
		}


	</div>
}