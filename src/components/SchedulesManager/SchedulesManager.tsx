import "./SchedulesManager.scss";
import React from "react";
import cx from "classnames";
import { useSchedulesManagerController } from "./useSchedulesManagerController";
import { ScheduleItem } from "../ScheduleItem/ScheduleItem";
import { Type } from "../Type/Type";
import { CircularProgress } from "@material-ui/core";
import { motion, AnimateSharedLayout } from "framer-motion"
import { SchedulesEmpty } from "../SchedulesEmpty/SchedulesEmpty";
import { useTrueAfterTimeout } from "../../hooks/utils/useTrueAfterTimeout";

export type SchedulesManagerProps = {

};

export function SchedulesManager(props: SchedulesManagerProps) {

	const controller = useSchedulesManagerController(props)
	const shouldAnimate = useTrueAfterTimeout(100)

	return <div className={cx("SchedulesManager")}>
		<AnimateSharedLayout>
			{

				controller.schedulesLoaded
					? controller.activeSchedules.length === 0
						? <SchedulesEmpty />
						: <motion.ul
							layout={shouldAnimate ? "position" : undefined}
							className="active"
						>
							{
								controller.activeSchedules.map(schedule => (
									<motion.li
										layout={shouldAnimate ? "position" : undefined}
										key={schedule.id}
									>
										<ScheduleItem schedule={schedule} />
									</motion.li>
								))
							}
						</motion.ul>
					: <div className="loader">
						<CircularProgress variant="indeterminate" />
					</div>
			}

			{
				controller.inactiveSchedules.length > 0 && <>
					<Type variant="bold" className="title">
						{"Ended"}
					</Type>
					<motion.ul
						layout={shouldAnimate ? "position" : undefined}
						className="inactive"
					>
						{
							controller.inactiveSchedules.map(schedule => (
								<motion.li
									layout={shouldAnimate ? "position" : undefined}
									key={schedule.id}
								>
									<ScheduleItem schedule={schedule} />
								</motion.li>
							))
						}
					</motion.ul>
				</>
			}
		</AnimateSharedLayout>
	</div>
}