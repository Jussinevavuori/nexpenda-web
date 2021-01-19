import "./FileUploader.scss";
import React from "react"
import { EnhancedButton } from "../EnhancedButton/EnhancedButton";
import { Publish as UploadIcon, Close as CancelIcon } from "@material-ui/icons"
import { Button, ButtonGroup } from "@material-ui/core";
import { useFileUploaderController } from "./useFileUploaderController";

export type FileUploaderProps = {
}

export function FileUploader(props: FileUploaderProps) {

	const controller = useFileUploaderController(props)

	const buttonLabel = (() => {
		if (controller.result === null) {
			return "Error"
		} else if (controller.result) {
			return `Upload ${controller.result.succeeded} rows`
		} else if (controller.uploading) {
			return "Uploading..."
		} else if (controller.parsing) {
			return "Reading file..."
		} else {
			return "Upload file"
		}
	})()

	return <div className="FileUploader">

		<ButtonGroup
			color="primary"
			fullWidth
		>

			{
				controller.result
					? <EnhancedButton
						key="file-uploader-button-no-result"
						component="label"
						color="primary"
						variant={"contained"}
						onClick={() => controller.handleUpload()}
						fullWidth
						loading={controller.uploading || controller.parsing}
						endIcon={<UploadIcon />}
						children={buttonLabel}
					/>
					: <EnhancedButton
						key="file-uploader-button-has-result"
						component="label"
						color="primary"
						variant={"outlined"}
						fullWidth
						loading={controller.uploading || controller.parsing}
					>
						{buttonLabel}
						<input
							type="file"
							style={{ display: "none" }}
							onChange={controller.handleFileUpload}
						/>
					</EnhancedButton>
			}



			{
				controller.result
					? <Button
						className="cancelButton"
						color="primary"
						variant={"outlined"}
						onClick={controller.handleCancel}
						disabled={controller.uploading || controller.parsing}
					>
						<CancelIcon />
					</Button>
					: null
			}

		</ButtonGroup>

	</div >
}