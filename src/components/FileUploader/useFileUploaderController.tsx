import ReactGA from "react-ga";
import React, { useState } from "react"
import { useStoreActions } from "../../store"
import { DataUtils } from "../../utils/DataUtils/DataUtils"
import { SpreadsheetReadFileResult } from "../../utils/FileIO/Spreadsheet"
import { IOJsonTransaction, TransactionSpreadsheet } from "../../utils/FileIO/TransactionSpreadsheet"
import { FileUploaderProps } from "./FileUploader"

export function useFileUploaderController(props: FileUploaderProps) {

	const postTransactions = useStoreActions(_ => _.transactions.postTransactions)

	const [result, setResult] = useState<undefined | null | SpreadsheetReadFileResult<IOJsonTransaction>>()
	const [parsing, setParsing] = useState(false)
	const [uploading, setUploading] = useState(false)

	const notify = useStoreActions(_ => _.notification.notify)

	/**
	 * Canceling resets all status
	 */
	function handleCancel() {
		setResult(undefined)
		setParsing(false)
		setUploading(false)
	}

	/**
	 * 
	 * @param e Change event from an input[type="file"] element after a file
	 * has been uploaded.
	 */
	async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {

		// Mark as parsing
		setParsing(true)

		// Read the result to a transaction spreadsheet
		const transactionSpreadsheet = new TransactionSpreadsheet()
		const readResult = await transactionSpreadsheet.readFile(e.target)

		// If read succeeded, show result, else show error
		if (readResult.isSuccess()) {
			ReactGA.event({
				action: "Upload Transactions File",
				category: "Transactions Files",
				label: "Upload file",
				value: readResult.value.total,
			})
			const s = readResult.value.succeeded
			const t = readResult.value.total
			notify({ message: `File read (${s}/ ${t} rows)` })
			setResult(readResult.value)
		} else {
			notify({ message: `Error reading file` })
			setResult(null)
		}

		// Reset parsing
		setParsing(false)
	}

	/**
	 * After a file has been read, handle uploading the rows to the
	 * server.
	 */
	async function handleUpload() {

		// Find all rows to upload, if none exist, notify error and stop
		const rowsToUpload = result?.rows
		if (!rowsToUpload) {
			setParsing(false)
			setUploading(false)
			return notify({
				message: "No transactions found in file",
				severity: "warning",
			})
		}

		// Start uploading indicator
		setUploading(true)

		// Chunkify rows to chunks of hundreds and post those chunks one by one
		const chunks = DataUtils.chunkify(rowsToUpload, 100)
		const postResults: PromiseType<ReturnType<typeof postTransactions>>[] = []
		for (const chunk of chunks) {
			const result = await postTransactions(chunk)
			postResults.push(result)
		}

		// Check whether all chunks were succesfully posted
		if (postResults.every(_ => _.isSuccess())) {

			// Count total number of rows uploaded
			const total = postResults.reduce((sum, chunk) => {
				if (chunk.isSuccess()) {
					return sum + chunk.value.t.length
				} else {
					return sum
				}
			}, 0)

			// Notify success
			notify({
				message: `${total} / ${rowsToUpload.length} transactions succesfully uploaded.`,
				severity: "success"
			})
		}

		// Check if any failures occured
		const failure = postResults.find(_ => _.isFailure())
		if (failure && failure.isFailure()) {
			notify({
				message:
					failure.reason === "invalidServerResponse"
						? "Invalid response from server"
						: "Failure to upload transactions",
				severity: "error",
			})
		}

		// Rest status
		setUploading(false)
		setResult(undefined)
		setParsing(false)
	}

	return {
		handleFileUpload,
		handleUpload,
		handleCancel,
		parsing,
		uploading,
		result,
	}
}