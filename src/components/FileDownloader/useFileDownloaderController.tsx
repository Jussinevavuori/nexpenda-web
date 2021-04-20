import ReactGA from "react-ga";
import { useCallback, useState } from "react"
import { useStoreActions, useStoreState } from "../../store"
import { TransactionSpreadsheet } from "../../utils/FileIO/TransactionSpreadsheet"
import { FileDownloaderProps } from "./FileDownloader"

export function useFileDownloaderController(props: FileDownloaderProps) {

	const transactions = useStoreState(_ => _.transactions.items)

	const notify = useStoreActions(_ => _.notification.notify)

	const [loading, setLoading] = useState(false)

	const handleDownload = useCallback(async () => {

		setLoading(true)

		const spreadsheet = new TransactionSpreadsheet(transactions)
		spreadsheet.downloadFile()

		setLoading(false)

		ReactGA.event({
			action: "Download Transactions File",
			category: "Transactions Files",
			label: spreadsheet.getFileName(),
			value: spreadsheet.getRowsCount(),
		})

		notify({ message: `File downloaded.` })

	}, [setLoading, notify, transactions])

	return {
		loading,
		handleClick: handleDownload,
	}
}