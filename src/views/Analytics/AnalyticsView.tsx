import "./Analytics.scss";
import React from "react"
import { useStoreActions } from "../../store";

export type AnalyticsViewProps = {

}

export function AnalyticsView(props: AnalyticsViewProps) {

	const postTransaction = useStoreActions(_ => _.transactions.postTransaction)

	function handleChange(e: React.ChangeEvent<HTMLInputElement>) {

		console.log("Handling change")

		if (!e.target.files) throw new Error("No files array")

		const file = e.target.files[0]

		if (!file) throw new Error("No file")

		const reader = new FileReader();

		reader.addEventListener('load', function (e) {

			if (!e.target) throw new Error("No load event target")

			if (!e.target.result) throw new Error("Load event target result is null")

			const csvData = e.target.result.toString()

			// const result: Transaction[] = []

			const rows = csvData.split("\n")

			for (const row of rows) {

				if (row) {

					const values = row.split(";")

					postTransaction({
						category: values[1],
						comment: values[3],
						integerAmount: Number(values[2].replace(/[^\d-]/g, '')),
						time: new Date(values[0].split(".").reverse().map(_ => _.padStart(2, "0")).join("-")).getTime(),
					})

				}

			}

		})

		reader.readAsText(file)

	}

	return <div className="Analytics">

		<input type="file" accept=".csv" onChange={handleChange} />

	</div>
}