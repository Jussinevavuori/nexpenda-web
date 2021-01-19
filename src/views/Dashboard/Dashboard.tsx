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

export type DashboardProps = {
}

export function Dashboard(props: DashboardProps) {

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
					controller.showTransactionForm
						? <motion.section
							initial={{ opacity: 0, y: -20 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -20, transition: { type: "tween" } }}
							className={cx(
								"transactionForm",
								{ open: controller.showTransactionForm }
							)}
						>
							<TransactionForm
								variant="horizontal"
								hideTitle
								onClose={controller.handleTransactionFormClose}
							/>
						</motion.section>
						: null
				}
			</AnimatePresence>

			<motion.section layout className="transactionsList">
				{
					controller.isDesktopLayout
						? <TransactionTable showSkeletons />
						: <TransactionList showSkeletons />
				}
			</motion.section>
		</AnimateSharedLayout>

	</div>

}