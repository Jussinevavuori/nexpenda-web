import "./FileDownloader.scss";
import React from "react"
import { EnhancedButton } from "../EnhancedButton/EnhancedButton";
import { GetApp as DownloadIcon } from "@material-ui/icons"

export type FileDownloaderViewProps = {
	handleClick(): void;
	loading?: boolean;
}

export function FileDownloaderView(props: FileDownloaderViewProps) {
	return <EnhancedButton
		component="label"
		color="primary"
		onClick={props.handleClick}
		fullWidth
		variant="outlined"
		loading={props.loading}
		endIcon={<DownloadIcon />}
	>
		{"Download file"}
	</EnhancedButton>
}