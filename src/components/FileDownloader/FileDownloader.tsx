import "./FileDownloader.scss";
import React from "react"
import { EnhancedButton } from "../EnhancedButton/EnhancedButton";
import { GetApp as DownloadIcon } from "@material-ui/icons"
import { useFileDownloaderController } from "./useFileDownloaderController";

export type FileDownloaderProps = {
}

export function FileDownloader(props: FileDownloaderProps) {

	const controller = useFileDownloaderController(props)

	return <EnhancedButton
		component="label"
		color="primary"
		onClick={controller.handleClick}
		fullWidth
		variant="outlined"
		loading={controller.loading}
		endIcon={<DownloadIcon />}
	>
		{"Export transactions"}
	</EnhancedButton>
}