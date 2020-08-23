import styles from "./AppLayout.module.css"
import React from "react"
import AppTabs from "../AppTabs/AppTabs"
import { TransactionFormModal } from "../TransactionFormModal/TransactionFormModalController"

type AppLayoutProps = {
	children?: React.ReactNode
}

export default function AppLayout(props: AppLayoutProps) {
	return <>

		<TransactionFormModal />

		<div className={styles.root}>
			<AppTabs />
			<div className={styles.childrenContainer}>
				{props.children}
			</div>
		</div>
	</>
}
