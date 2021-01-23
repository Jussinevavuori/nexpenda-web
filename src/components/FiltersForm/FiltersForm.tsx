import "./FiltersForm.scss";
import React from "react"
import { Sort as FiltersIcon, Clear as ClearIcon } from "@material-ui/icons";
import { Button, TextField, InputAdornment, IconButton } from "@material-ui/core";
import { Type } from "../Type/Type";
import { useFiltersFormController } from "./useFiltersFormController";

export type FiltersFormProps = {
	onConfirm?(): void;
}

export function FiltersForm(props: FiltersFormProps) {

	const controller = useFiltersFormController(props)

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
				onClick={controller.onResetAll}
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
				value={controller.searchTermFilter}
				onChange={e => controller.setSearchTermFilter(e.target.value)}
				variant="outlined"
				size="small"
				fullWidth
				InputProps={{
					endAdornment: <InputAdornment position="end">
						<IconButton size="small" onClick={controller.onResetSearchTermFilter}>
							<ClearIcon />
						</IconButton>
					</InputAdornment>
				}}
			/>

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