import React, { useState } from "react"
import { IOJsonTransaction, TransactionSpreadsheet } from "../../utils/FileIO/TransactionSpreadsheet"
import { FileUploaderView } from "./FileUploaderView"

export type FileUploaderProps = {

}

export function FileUploader(props: FileUploaderProps) {

	const [result, setResult] = useState<undefined | null | { success: IOJsonTransaction[], failed: number }>()
	const [parsing, setParsing] = useState(false)
	const [uploading, setUploading] = useState(false)

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
		setUploading(true)
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