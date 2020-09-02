import "./AppLayout.scss"
import React from "react"
import AppTabs from "../AppTabs/AppTabs"
import { TransactionFormModal } from "../TransactionFormModal/TransactionFormModalController"

type AppLayoutProps = {
	children?: React.ReactNode
}

export default function AppLayout(props: AppLayoutProps) {
	return <>

		<TransactionFormModal />

		<div className="AppLayout">
			<div className="appTabsContainer">
				< AppTabs />
			</div>
			<div className="childrenContainer">
				{props.children}
			</div>
		</div>
	</>
}
