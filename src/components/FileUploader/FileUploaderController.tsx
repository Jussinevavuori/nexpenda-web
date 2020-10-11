import React, { useState } from "react"
import { useMountedRef } from "../../hooks/useMountedRef"
import { useStoreActions } from "../../store"
import { PromiseType } from "../../types"
import { SpreadsheetReadFileResult } from "../../utils/FileIO/Spreadsheet"
import { IOJsonTransaction, TransactionSpreadsheet } from "../../utils/FileIO/TransactionSpreadsheet"
import { ProcessQueue, ProcessQueueProgress } from "../../utils/ProcessQueue/ProcessQueue"
import { FileUploaderView } from "./FileUploaderView"

export type FileUploaderProps = {

}

export function FileUploader(props: FileUploaderProps) {

	const postTransaction = useStoreActions(_ => _.transactions.postTransaction)

	const [result, setResult] = useState<undefined | null | SpreadsheetReadFileResult<IOJsonTransaction>>()
	const [parsing, setParsing] = useState(false)
	const [uploading, setUploading] = useState(false)
	const [progress, setProgress] = useState<ProcessQueueProgress<PromiseType<ReturnType<typeof postTransaction>>>>()

	const mounted = useMountedRef()

	async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
		setParsing(true)
		const transactionSpreadsheet = new TransactionSpreadsheet()
		const readResult = await transactionSpreadsheet.readFile(e.target)
		if (readResult.isSuccess()) {
			setResult(readResult.value)
		} else {
			setResult(null)
		}
		setParsing(false)
	}

	async function handleUpload() {

		const rowsToUpload = result?.rows
		if (!rowsToUpload) {
			console.error("There are not rows to upload")
			return
		}

		setUploading(true)
		const uploadProcessQueue = new ProcessQueue({
			chunksize: 7,
			updateProgress: (progress) => {
				if (!mounted.current) return
				setProgress(progress)
			},
			queue: rowsToUpload.map(row => () => {
				return postTransaction(row)
			})
		})
		await uploadProcessQueue.run()
		setUploading(false)
	}

	return <FileUploaderView
		handleFileUpload={handleFileUpload}
		handleUpload={handleUpload}
		parsing={parsing}
		uploading={uploading}
		result={result}
		progress={progress}
	/>
}