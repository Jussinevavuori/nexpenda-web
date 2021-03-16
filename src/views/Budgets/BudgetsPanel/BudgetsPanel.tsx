import "./BudgetsPanel.scss";
import React from "react";
import cx from "classnames";
// import { useBudgetsPanelController } from "./useBudgetsPanelController";
import { IntervalManager } from "../../../components/IntervalManager/IntervalManager";
import { useMdMedia } from "../../../hooks/utils/useMedia";

export type BudgetsPanelProps = {

};

export function BudgetsPanel(props: BudgetsPanelProps) {
	// const controller = useBudgetsPanelController(props)
	const isDesktopLayout = useMdMedia()

	return <div className={cx("BudgetsPanel")}>
		<IntervalManager reverseControls={!isDesktopLayout} />
	</div>
}