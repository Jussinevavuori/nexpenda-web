import "./FileUploader.scss";
import React from "react";
import cx from "classnames";
import { useFileUploaderController } from "./useFileUploaderController";
import { Button, Step, StepContent, StepLabel, Stepper, Tab, Tabs } from "@material-ui/core";
import { CheckCircleOutline, Error, Info, Publish as UploadIcon } from "@material-ui/icons"
import { Type } from "../Type/Type";
import { ExampleSpreadsheet } from "../ExampleSpreadsheet/ExampleSpreadsheet";
import { EnhancedButton } from "../EnhancedButton/EnhancedButton";
import { TransactionSpreadsheetReadSheetResult } from "../TransactionSpreadsheetReadSheetResult/TransactionSpreadsheetReadSheetResult";
import { motion } from "framer-motion";

export type FileUploaderProps = {
	onFinished?(): void;
};

export function FileUploader(props: FileUploaderProps) {

	const controller = useFileUploaderController(props)

	return <div className={cx("FileUploader")}>


		<Stepper
			activeStep={controller.activeStep}
			orientation="vertical"
		>
			{/* UPLOAD FILE */}

			<Step>
				<StepLabel>
					<Type
						variant="boldcaps"
						color={
							controller.activeStep === controller.steps.upload
								? "primary-600"
								: "gray-600"
						}
					>
						{"Upload file"}
					</Type>
				</StepLabel>
				<StepContent
					className="FileUploader__step FileUploader__uploadFileStep"
				>

					<Type>
						{"Upload a spreadsheet file. Ensure the spreadsheet contains data "}
						{"that matches the following format."}
					</Type>

					<div className="exampleSpreadsheetContainer">
						<ExampleSpreadsheet />
					</div>

					<EnhancedButton
						component="label"
						color="primary"
						variant="contained"
						loading={controller.readFileState.isParsing}
						startIcon={<UploadIcon />}
					>
						{
							controller.readFileState.isParsing
								? "Uploading file..."
								: "Upload file"
						}
						<input
							type="file"
							style={{ display: "none" }}
							onChange={controller.handleFileUpload}
						/>
					</EnhancedButton>

					{
						controller.readFileState.error &&
						<div className="iconTypeContainer error">
							<Error />
							<Type color="red-800">
								{controller.readFileState.error}
							</Type>
						</div>
					}

					<div className="iconTypeContainer">
						<Info />
						<Type color="gray-700">
							{"The column names MUST be on the first row! "}
							{"The case of the column titles does not matter. "}
							{"The column titles have to be on the first row. "}
							{"The spreadsheet can include other sheets and columns. "}
						</Type>
					</div>

				</StepContent>
			</Step>

			{/* REVIEW UPLOADED FILE */}

			<Step>
				<StepLabel>
					<Type
						variant="boldcaps"
						color={
							controller.activeStep === controller.steps.review
								? "primary-600"
								: "gray-600"
						}
					>
						{"Review"}
					</Type>
				</StepLabel>
				<StepContent
					className="FileUploader__step FileUploader__reviewStep"
				>

					<Type>
						{"Your spreadsheet was succesfully read. "}
						{"Select the sheet that contains all of your transactions and "}
						{"press \"Upload transactions\" to upload them."}
					</Type>

					<Tabs
						className="FileUploader__reviewTabs"
						value={controller.selectedSheetName}
						onChange={(_, v) => controller.setSelectedSheetName(String(v))}
						indicatorColor="primary"
						textColor="primary"
						variant="scrollable"
						scrollButtons="off"
					>
						{
							controller.sheetNames.map((sheetName, i) => <Tab
								key={sheetName}
								label={sheetName}
								value={sheetName}
								id={`scrollable-auto-tab-${i}`}
								{...{ "aria-controls": `scrollable-auto-tabpanel-${i}` }}
							/>)
						}
					</Tabs>

					{
						controller.selectedSheet &&
						<div className="reviewSpreadsheetContainer">
							<TransactionSpreadsheetReadSheetResult
								data={controller.selectedSheet.result}
								maxRowsCount={10}
							/>
						</div>
					}

					<div className="FileUploader__stepActions">
						<Button
							variant="outlined"
							color="primary"
							onClick={controller.handleResetState}
						>
							{"Back"}
						</Button>
						<EnhancedButton
							color="primary"
							variant="contained"
							loading={controller.uploadFileState.isUploading}
							onClick={controller.handleUploadTransactions}
							startIcon={<UploadIcon />}
						>
							{
								controller.uploadFileState.isUploading
									? "Uploading transactions..."
									: "Upload transactions"
							}
						</EnhancedButton>
					</div>

					{
						controller.uploadFileState.isUploading && (controller.selectedSheet?.result.succeeded ?? 0) > 100 &&
						<div className="iconTypeContainer">
							<Info />
							<Type>
								{"You have a lot of transactions. This may take a while..."}
							</Type>
						</div>

					}

					{
						controller.uploadFileState.error &&
						<div className="iconTypeContainer error">
							<Error />
							<Type color="red-800">
								{controller.uploadFileState.error}
							</Type>
						</div>
					}

				</StepContent>
			</Step>
		</Stepper>

		{
			controller.activeStep === controller.steps.finished &&
			<div className="FileUploader__finishedStep">
				<motion.div
					className="iconContainer"
					transition={{ delay: 0.5 }}
					initial={{ scale: 0 }}
					animate={{ scale: 1 }}
				>
					<CheckCircleOutline />
				</motion.div>
				<Type color="primary-600" size="xl">
					{`Success!`}
				</Type>
				<Type color="gray-800">
					{`${controller.selectedSheet?.result.succeeded} rows succesfully `}
					{"uploaded!"}
				</Type>

				<Button
					variant="contained"
					color="primary"
					onClick={controller.handleFinish}
				>
					{"Close"}
				</Button>

			</div>
		}

	</div>
}