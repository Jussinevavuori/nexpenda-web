import "./DefaultViewPanel.scss";
import React from "react";
import cx from "classnames";
import { useDefaultViewPanelController } from "./useDefaultViewPanelController";
import { ViewPanel } from "../ViewPanel/ViewPanel";
import { IntervalManager } from "../IntervalManager/IntervalManager";
import { useMdMedia } from "../../hooks/utils/useMedia";

export type DefaultViewPanelProps = {

};

export function DefaultViewPanel(props: DefaultViewPanelProps) {
	useDefaultViewPanelController(props)
	const isDesktopLayout = useMdMedia()

	return <ViewPanel className={cx("DefaultViewPanel")}>
		<IntervalManager reverseControls={!isDesktopLayout} />
	</ViewPanel>
}