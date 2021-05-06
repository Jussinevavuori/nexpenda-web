import "./Dashboard.scss"
import React from "react";
import cx from "classnames"
import { TransactionList } from "../../components/TransactionList/TransactionList";
import { TransactionTable } from "../../components/TransactionTable/TransactionTable";
import { DashboardOverview } from "./DashboardOverview/DashboardOverview";
import { TransactionForm } from "../../components/TransactionForm/TransactionForm";
import { useDashboardController } from "./useDashboardController";
import { AnimatePresence, AnimateSharedLayout, motion } from "framer-motion";
import { useTrueAfterTimeout } from "../../hooks/utils/useTrueAfterTimeout";
import { ViewContainer } from "../../components/ViewContainer/ViewContainer";
import { ViewHeader } from "../../components/ViewHeader/ViewHeader";
import { Type } from "../../components/Type/Type";
import { MoneyType } from "../../components/MoneyType/MoneyType";
import { DashboardActions } from "./DashboardActions/DashboardActions";
import { DashboardPanel } from "./DashboardPanel/DashboardPanel";
import { MiniFreemiumTracker } from "../../components/MiniFreemiumTracker/MiniFreemiumTracker";

export type DashboardProps = {
}

export function Dashboard(props: DashboardProps) {
	const trueAfterTimeout = useTrueAfterTimeout(100)
	const controller = useDashboardController()

	return <ViewContainer
		viewHeader={<ViewHeader>
			<div className="Dashboard__headerContent">
				<p>
					<Type
						component="span"
						variant="boldcaps"
						size="sm"
						color={"white"}
					>
						{`${controller.transactionsCount} transactions`}
					</Type>
					<Type
						component="span"
						variant="boldcaps"
						size="sm"
						color="primary-300"
					>
						{controller.intervalLabel}
					</Type>
				</p>
				<MoneyType
					size="xxl"
					color="white"
					amount={controller.transactionsTotal}
					animate
				/>
				<MiniFreemiumTracker variant="transaction" className="limit" />
			</div>
		</ViewHeader>}
		viewPanel={<DashboardPanel />}
	>
		<div className="Dashboard">

			{
				controller.isDesktopLayout && <>
					<section className="header">
						<DashboardOverview />
					</section>
					<section className="actions">
						<DashboardActions />
					</section>
				</>
			}

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

				<motion.section
					layout={trueAfterTimeout && controller.isDesktopLayout ? "position" : undefined}
					initial={false}
					className="transactionsList"
				>
					{
						controller.isDesktopLayout
							? <TransactionTable showSkeletons />
							: <TransactionList showSkeletons />
					}
				</motion.section>
			</AnimateSharedLayout>

		</div>
	</ViewContainer>

}