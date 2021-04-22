import "./UploadFileButton.scss";
import React from "react";
import cx from "classnames";
import { useUploadFileButtonController } from "./useUploadFileButtonController";
import { EnhancedButton, EnhancedButtonProps } from "../EnhancedButton/EnhancedButton";

export type UploadFileButtonProps = {
	onChange?: React.ChangeEventHandler<HTMLInputElement>;
} & Omit<EnhancedButtonProps, "onChange">;

export function UploadFileButton(props: UploadFileButtonProps) {

	const controller = useUploadFileButtonController(props)

	return <EnhancedButton
		{...controller.ButtonProps}
		className={cx("UploadFileButton", props.className)}
	>
		{props.children}
		<input
			className="fileInput"
			type="file"
			onChange={props.onChange}
		/>
	</EnhancedButton>
}