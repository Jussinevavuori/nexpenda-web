import "./Dashboard.scss"
import React from "react";
import { TransactionList } from "../../components/TransactionList/TransactionListController";
import { Auth } from "../../classes/Auth";
import { ActionsPanel } from "./ActionsPanel/ActionsPanelController";
import { useMdMedia } from "../../hooks/useMedia";
import { TransactionTable } from "../../components/TransactionTable/TransactionTableController";
import { Transaction } from "../../classes/Transaction";
import { DashboardHeader } from "./DashboardHeader/DashboardHeaderController";
import { motion, Variants } from "framer-motion";

export type DashboardViewProps = {
	user: Auth | null;
	intervalString: string;

	filtersActive: boolean;

	selectionActive: boolean;
	selection: Transaction[];
	onSelectAll(): void;
	onDeselectAll(): void;
}

export function DashboardView(props: DashboardViewProps) {

	const desktopLayout = useMdMedia()

	return <motion.div className="Dashboard"
		variants={variants}
		initial="hidden"
		animate="show"
	>

		<section className="header">
			<DashboardHeader />
		</section>

		<section className="panel">
			<ActionsPanel />
		</section>

		<section className="transactionsList">

			{
				desktopLayout
					? <TransactionTable showSkeletons />
					: <TransactionList showSkeletons />
			}

		</section>

	</motion.div>

}

const variants: Variants = {
	hidden: {
		y: 40,
		opacity: 0,
	},
	show: {
		y: 0,
		opacity: 1,
		transition: {
			type: "bounce",
			duration: 1,
		}
	}
}