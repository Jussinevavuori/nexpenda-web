import React, { useCallback, useState } from "react"
import { useStoreActions, useStoreState } from "../../store"
import { TransactionSpreadsheet } from "../../utils/FileIO/TransactionSpreadsheet"
import { FileDownloaderView } from "./FileDownloaderView"

export type FileDownloaderProps = {

}

export function FileDownloader(props: FileDownloaderProps) {

	const transactions = useStoreState(_ => _.transactions.items)

	const notify = useStoreActions(_ => _.notification.notify)

	const [loading, setLoading] = useState(false)

	const handleDownload = useCallback(async () => {

		setLoading(true)

		const spreadsheet = new TransactionSpreadsheet()

		spreadsheet.createFile(transactions.map(t => ({
			category: t.category.value,
			integerAmount: t.amount.value,
			time: t.date.getTime(),
			comment: t.comment,
		})))

		spreadsheet.downloadFile()

		setLoading(false)

		notify({
			message: `File downloaded.`
		})

	}, [setLoading, notify, transactions])

	return <FileDownloaderView
		handleClick={handleDownload}
		loading={loading}
	/>
}