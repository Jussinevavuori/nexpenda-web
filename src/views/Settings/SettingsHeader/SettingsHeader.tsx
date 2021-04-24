import "./SettingsHeader.scss";
import React from "react";
import textureImg from "../../../images/shapelined-_JBKdviweXI-unsplash.jpg";
import cx from "classnames";
// import { useSettingsHeaderController } from "./useSettingsHeaderController";
import { useMdMedia } from "../../../hooks/utils/useMedia";
import { UserAvatar } from "../../../components/UserAvatar/UserAvatar";

export type SettingsHeaderProps = {

};

export function SettingsHeader(props: SettingsHeaderProps) {

	const isDesktop = useMdMedia()

	// const controller = useSettingsHeaderController(props)

	/**
	 * Desktop view
	 */
	if (isDesktop) {
		return <div className={cx("SettingsHeader desktop")} />
	}

	/**
	 * Mobile view
	 */
	else {
		return <div className={cx("SettingsHeader mobile")}>
			<div className="texture-image-container">
				<img src={textureImg} alt="" />
			</div>

			<div className="content">
				<UserAvatar />
			</div>
		</div>
	}
}