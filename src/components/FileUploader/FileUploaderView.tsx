import "./FileUploader.scss";
import React from "react"
import { Type } from "../Type/Type";
import { IOJsonTransaction } from "../../utils/FileIO/TransactionSpreadsheet";
import { SpreadsheetReadFileResult } from "../../utils/FileIO/Spreadsheet";
import { ProcessQueueProgress } from "../../utils/ProcessQueue/ProcessQueue";
import { EnhancedButton } from "../EnhancedButton/EnhancedButton";

export type FileUploaderViewProps = {
	handleFileUpload(e: React.ChangeEvent<HTMLInputElement>): Promise<void>;
	handleUpload(): Promise<void>;
	parsing: boolean;
	uploading: boolean;
	result: undefined | null | SpreadsheetReadFileResult<IOJsonTransaction>;
	progress?: ProcessQueueProgress<any>;
}

export function FileUploaderView(props: FileUploaderViewProps) {

	return <div className="FileUploader">

		<EnhancedButton
			component="label"
			color="primary"
			variant="contained"
			loading
		>
			{"Test"}
			{/* 
			{
				props.result === null
					? "Error"
					: props.result
						? "Upload"
						: props.uploading
							? "Uploading..."
							: props.parsing
								? "Reading file..."
								: "Upload file"
			}

			<input
				type="file"
				style={{ display: "none" }}
				onChange={props.handleFileUpload}
			/> */}

		</EnhancedButton>

		{
			(() => {

				if (props.result === null) {
					return <Type color="error" variant="subtitle1">
						{"Invalid file"}
					</Type>
				}

				else if (props.result) {
					return <Type>
						{`File read (${props.result.succeeded}/ ${props.result.total} rows)`}
					</Type>
				}

			})()
		}

	</div>
}