import React, { useState } from "react"
import { useStoreActions } from "../../store"
import { SpreadsheetReadFileResult } from "../../utils/FileIO/Spreadsheet"
import { IOJsonTransaction, TransactionSpreadsheet } from "../../utils/FileIO/TransactionSpreadsheet"
import { FileUploaderView } from "./FileUploaderView"

export type FileUploaderProps = {

}

export function FileUploader(props: FileUploaderProps) {

	const postTransactions = useStoreActions(_ => _.transactions.postTransactions)

	const [result, setResult] = useState<undefined | null | SpreadsheetReadFileResult<IOJsonTransaction>>()
	const [parsing, setParsing] = useState(false)
	const [uploading, setUploading] = useState(false)

	const notify = useStoreActions(_ => _.notification.notify)

	async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
		setParsing(true)
		const transactionSpreadsheet = new TransactionSpreadsheet()
		const readResult = await transactionSpreadsheet.readFile(e.target)
		if (readResult.isSuccess()) {
			const s = readResult.value.succeeded
			const t = readResult.value.total
			notify({ message: `File read (${s}/ ${t} rows)` })
			setResult(readResult.value)
		} else {
			notify({ message: `Error reading file` })
			setResult(null)
		}
		setParsing(false)
	}

	async function handleUpload() {

		const rowsToUpload = result?.rows

		if (!rowsToUpload) {
			return notify({
				message: "There are not rows to upload",
				severity: "warning",
			})
		}

		setUploading(true)

		const postResult = await postTransactions(rowsToUpload)

		if (postResult.isSuccess()) {
			notify({
				message: `${postResult.value.length} transactions uploaded.`
			})
		} else {
			notify({
				message: (() => {
					if (postResult.reason === "invalidServerResponse") {
						return "Invalid response from server"
					} else {
						switch (postResult.code) {
							default:
								return "Failure to upload transactions"
						}
					}
				})(),
				severity: "error",
			})
		}

		setUploading(false)
	}

	return <FileUploaderView
		handleFileUpload={handleFileUpload}
		handleUpload={handleUpload}
		parsing={parsing}
		uploading={uploading}
		result={result}
	/>
}