import "./Dashboard.scss"
import React from "react";
import cx from "classnames"
import { TransactionList } from "../../components/TransactionList/TransactionList";
import { ActionsPanel } from "./ActionsPanel/ActionsPanel";
import { TransactionTable } from "../../components/TransactionTable/TransactionTable";
import { DashboardHeader } from "./DashboardHeader/DashboardHeader";
import { TransactionForm } from "../../components/TransactionForm/TransactionForm";
import { useDashboardController } from "./useDashboardController";
import { AnimatePresence, AnimateSharedLayout, motion } from "framer-motion";
import { useTrueAfterTimeout } from "../../hooks/useTrueAfterTimeout";

export type DashboardProps = {
}

export function Dashboard(props: DashboardProps) {

	const trueAfterTimeout = useTrueAfterTimeout(100)

	const controller = useDashboardController()

	return <div className="Dashboard">

		<section className="header">
			<DashboardHeader />
		</section>

		<section className="panel">
			<ActionsPanel />
		</section>

		<AnimateSharedLayout>
			<AnimatePresence>
				{
					controller.showCreateTransactionForm
						? <motion.section
							initial={{ opacity: 0, y: -20 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -20, transition: { type: "tween" } }}
							className={cx(
								"transactionForm",
								{ open: controller.showCreateTransactionForm }
							)}
						>
							<TransactionForm
								hideTitle
								variant="horizontal"
								onClose={controller.handleTransactionFormClose}
							/>
						</motion.section>
						: null
				}
			</AnimatePresence>

			<motion.section layout={trueAfterTimeout} initial={false} className="transactionsList">
				{
					controller.isDesktopLayout
						? <TransactionTable showSkeletons />
						: <TransactionList showSkeletons />
				}
			</motion.section>
		</AnimateSharedLayout>

	</div>

}