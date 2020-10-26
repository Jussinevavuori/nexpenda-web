import "./FileUploader.scss";
import React from "react"
import { IOJsonTransaction } from "../../utils/FileIO/TransactionSpreadsheet";
import { SpreadsheetReadFileResult } from "../../utils/FileIO/Spreadsheet";
import { EnhancedButton } from "../EnhancedButton/EnhancedButton";
import { Publish as UploadIcon, Close as CancelIcon } from "@material-ui/icons"
import { Button, ButtonGroup } from "@material-ui/core";

export type FileUploaderViewProps = {
	handleFileUpload(e: React.ChangeEvent<HTMLInputElement>): Promise<void>;
	handleUpload(): Promise<void>;
	handleCancel(): void;
	parsing: boolean;
	uploading: boolean;
	result: undefined | null | SpreadsheetReadFileResult<IOJsonTransaction>;
}

export function FileUploaderView(props: FileUploaderViewProps) {

	return <div className="FileUploader">

		<ButtonGroup
			color="primary"
			fullWidth
		>

			<EnhancedButton
				component="label"
				color="primary"
				variant={props.result ? "contained" : "outlined"}
				onClick={() => {
					if (props.result) {
						props.handleUpload()
					}
				}}
				fullWidth
				loading={props.uploading || props.parsing}
				endIcon={props.result ? <UploadIcon /> : null}
			>

				{
					(() => {
						if (props.result === null) {
							return "Error"
						} else if (props.result) {
							return `Upload ${props.result.succeeded}`
						} else if (props.uploading) {
							return "Uploading..."
						} else if (props.parsing) {
							return "Reading file..."
						} else {
							return "Upload file"
						}
					})()
				}

				{
					props.result
						? null
						: <input
							type="file"
							style={{ display: "none" }}
							onChange={props.handleFileUpload}
						/>
				}

			</EnhancedButton>
			{
				props.result
					? <Button
						className="cancelButton"
						color="primary"
						variant={"outlined"}
						onClick={props.handleCancel}
						disabled={props.uploading}
					>
						<CancelIcon />
					</Button>
					: null
			}
		</ButtonGroup>

	</div>
}