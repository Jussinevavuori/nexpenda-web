import "./Schedules.scss";
import React from "react";
import cx from "classnames";
import { useSchedulesController } from "./useSchedulesController";
import { SchedulesManager } from "../../components/SchedulesManager/SchedulesManager";
import { ViewContainer } from "../../components/ViewContainer/ViewContainer";
import { ViewHeader } from "../../components/ViewHeader/ViewHeader";
import { useIsDarkTheme } from "../../hooks/application/useIsThemeMode";
import { Type } from "../../components/Type/Type";
import { Button, IconButton } from "@material-ui/core";
import { ArrowBack } from "@material-ui/icons";
import { useMdMedia } from "../../hooks/utils/useMedia";

export type SchedulesProps = {

};

export function Schedules(props: SchedulesProps) {

	const controller = useSchedulesController(props)
	const isDarkTheme = useIsDarkTheme()
	const isDesktop = useMdMedia()

	return <ViewContainer
		scrollable
		viewHeader={<ViewHeader forceDefaultTypeRendering>
			<IconButton onClick={controller.navigateBack}>
				<ArrowBack />
			</IconButton>
			{"Schedules"}
		</ViewHeader>}
	>
		<div className={cx("Schedules")}>
			{
				isDesktop &&
				<Type
					component="h2"
					variant="bold"
					size="xl"
					color={isDarkTheme ? "gray-100" : "gray-900"}
				>
					<IconButton onClick={controller.navigateBack}>
						<ArrowBack />
					</IconButton>
					{`Schedules`}
				</Type>
			}

			<SchedulesManager />

			<Button color="primary" variant="contained" onClick={() => controller.handleCreate()}>
				{"Create new transaction schedule"}
			</Button>

		</div>
	</ViewContainer>
}