import "./UploadFileButton.scss";
import React from "react";
import cx from "classnames";
import { EnhancedButton, EnhancedButtonProps } from "../EnhancedButton/EnhancedButton";

export type UploadFileButtonProps = {
	onChange?: React.ChangeEventHandler<HTMLInputElement>;
	inputRef?: React.MutableRefObject<HTMLInputElement | null>;
	accept?: string;
} & Omit<EnhancedButtonProps, "onChange">;

export function UploadFileButton(props: UploadFileButtonProps) {
	const { onChange, accept, inputRef, className, children, ...ButtonProps } = props;

	return <EnhancedButton
		{...ButtonProps}
		className={cx("UploadFileButton", className)}
	>
		{children}
		<input
			className="fileInput"
			type="file"
			onChange={onChange}
			accept={accept}
			ref={inputRef}
		/>
	</EnhancedButton>
}