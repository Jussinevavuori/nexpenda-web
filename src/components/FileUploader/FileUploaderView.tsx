import "./FileUploader.scss";
import React from "react"
import { Type } from "../Type/Type";
import { IOJsonTransaction } from "../../utils/FileIO/TransactionSpreadsheet";
import { Button, CircularProgress } from "@material-ui/core";
import { SpreadsheetReadFileResult } from "../../utils/FileIO/Spreadsheet";
import { ProcessQueueProgress } from "../../utils/ProcessQueue/ProcessQueue";

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

		<Type>
			{"Tuo tiedostosta"}
		</Type>

		<input type="file" onChange={props.handleFileUpload} />

		{
			props.parsing ? <>
				<Type>
					{"Tiedostoa luetaan..."}
				</Type>
				<CircularProgress />
			</> : null
		}

		{
			props.result === null ? <>
				<Type>{"Tiedostoa ei pystytty lukemaan"}</Type>
			</> : props.result ? <>
				<Type>{"Tiedosto luettu"}</Type>
				<Type>{`Löytyi ${props.result.total} tapahtumaa`}</Type>
				{
					props.result.failed > 0
						? <Type color="error">{`${props.result.failed} tapahtumaa epäonnistui`}</Type>
						: <Type>{"Kaikki tapahtumat onnistuivat"}</Type>
				}
				<Button
					disabled={props.uploading}
					variant="outlined"
					onClick={props.handleUpload}
				>
					{
						props.uploading ?
							props.progress
								? <>
									{`Tiedostoa ladataan... ${props.progress.completed} / ${props.progress.total}`}
									<CircularProgress variant="static" value={(() => {
										if (props.progress.total <= 0) return 0
										else return 100 * (props.progress.completed / props.progress.total)
									})()} />
								</>
								: <>
									{"Tiedostoa ladataan... "}
									<CircularProgress />
								</>
							: <>
								{"Lataa tiedostot"}
							</>
					}
				</Button>
			</> : null
		}


	</div>
}