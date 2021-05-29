import "./AvatarChanger.scss";
import React from "react";
import cx from "classnames";
import { Type } from "../Type/Type";
import { UploadFileButton } from "../UploadFileButton/UploadFileButton";
import { useAvatarChangerController } from "./useAvatarChangerController";
import { EnhancedButton } from "../EnhancedButton/EnhancedButton";

export type AvatarChangerProps = {
	onSubmitted?(): void;
};

export function AvatarChanger(props: AvatarChangerProps) {

	const controller = useAvatarChangerController(props)

	return <div className={cx("AvatarChanger")}>

		<div className="preview">
			{
				controller.fileUrl &&
				<img src={controller.fileUrl} alt="Preview" />
			}
			<div className="noimage">
				<Type color="primary-400">{"Preview"}</Type>
			</div>
		</div>

		<div className="buttons">
			{
				controller.file &&
				<EnhancedButton
					variant="contained"
					color="primary"
					onClick={controller.handleSubmit}
					loading={controller.submitting}
				>
					{"Upload"}
				</EnhancedButton>
			}

			<UploadFileButton
				color="primary"
				variant={controller.file ? "outlined" : "contained"}
				inputRef={controller.inputRef}
				onChange={controller.handleChange}
				accept={".jpg,.jpeg,.png,image/jpeg,image/png"}
			>
				{
					controller.file
						? "Choose another image"
						: "Choose image"
				}
			</UploadFileButton>
		</div>

		<div className="info">
			<Type>
				{"Image must be a .jpg, .jpeg or .png file. Maximum allowed size is 10 Mb."}
			</Type>
			{
				controller.error &&
				<Type color="red-700">
					{controller.error}
				</Type>
			}
		</div>
	</div >
}