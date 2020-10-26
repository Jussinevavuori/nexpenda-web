import React, { useState } from "react"
import { useStoreActions } from "../../store"
import { PromiseType } from "../../types"
import { DataUtils } from "../../utils/DataUtils/DataUtils"
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

		/**
		 * Get all rows that are to be uploaded and ensure at the least
		 * some exist
		 */
		const rowsToUpload = result?.rows

		if (!rowsToUpload) {
			return notify({
				message: "There are not rows to upload",
				severity: "warning",
			})
		}

		/**
		 * Set uploading status
		 */
		setUploading(true)

		/**
		 * Chunkify to chunks of a hundred rows each and post one chunk
		 * by one
		 */
		const chunks = DataUtils.chunkify(rowsToUpload, 100)
		const postResults: PromiseType<ReturnType<typeof postTransactions>>[] = []
		for (const chunk of chunks) {
			const result = await postTransactions(chunk)
			postResults.push(result)
		}

		/**
		 * Check whether all chunks were succesfully posted
		 */
		if (postResults.every(_ => _.isSuccess())) {

			// Count total number of rows uploaded
			const total = postResults.reduce((sum, chunk) => {
				if (chunk.isSuccess()) {
					return sum + chunk.value.length
				} else {
					return sum
				}
			}, 0)

			// Notify success
			notify({
				message: `${total} transactions succesfully uploaded.`,
				severity: "success"
			})
		}

		/**
		 * Check if any failures occured
		 */
		const failure = postResults.find(_ => _.isFailure())
		if (!failure) {
			return
		} else if (failure.isFailure()) {
			notify({
				message:
					failure.reason === "invalidServerResponse"
						? "Invalid response from server"
						: "Failure to upload transactions",
				severity: "error",
			})
		}

		/**
		 * Update loading status
		 */
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