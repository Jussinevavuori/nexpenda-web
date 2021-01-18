import "./FiltersForm.scss";
import React from "react"
import { Sort as FiltersIcon, Clear as ClearIcon } from "@material-ui/icons";
import { Button, TextField, InputAdornment, IconButton, Slider } from "@material-ui/core";
import { Type } from "../Type/Type";

export type FiltersFormViewProps = {

	onConfirm?(): void;

	onResetAll(): void;

	onResetSearchTermFilter(): void;
	onResetAmountFilter(): void;

	searchTermFilter: string;
	minAmountFilter: number;
	maxAmountFilter: number;

	setSearchTermFilter(value: string): void;
	setAmountFilter(values: [number | undefined, number | undefined]): void;

	minPossibleAmount: number;
	maxPossibleAmount: number;
}

export function FiltersFormView(props: FiltersFormViewProps) {
	return <div className="FiltersForm">

		<header>

			<div className="title">
				<Type variant="boldcaps" color="gray-800">
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
				value={props.searchTermFilter}
				onChange={e => props.setSearchTermFilter(e.target.value)}
				variant="outlined"
				size="small"
				fullWidth
				InputProps={{
					endAdornment: <InputAdornment position="end">
						<IconButton size="small" onClick={props.onResetSearchTermFilter}>
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
					onClick={props.onResetAmountFilter}
				>
					{"Reset"}
				</Button>

			</div>

			<div className="sliderLabel">
				<Type>
					{
						props.minAmountFilter <= props.minPossibleAmount
							? "N/A"
							: Math.floor(props.minAmountFilter / 100) + " €"
					}
				</Type>
				<Type>
					{
						props.maxAmountFilter >= props.maxPossibleAmount
							? "N/A"
							: Math.ceil(props.maxAmountFilter / 100) + " €"
					}
				</Type>
			</div>

			<div className="sliderContainer">

				<Slider
					value={[Math.floor(props.minAmountFilter / 100), Math.ceil(props.maxAmountFilter / 100)]}
					onChange={(e, value) => Array.isArray(value) && value.length === 2
						? props.setAmountFilter(value.map(_ => _ * 100) as [number, number])
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

		{
			props.onConfirm === undefined ? null :
				<section className="submit">
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