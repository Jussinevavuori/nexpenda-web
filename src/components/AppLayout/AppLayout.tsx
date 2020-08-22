import styles from "./AppLayout.module.css"
import React from "react"
import AppTabs from "../AppTabs/AppTabs"
import AppNavbar from "../AppNavbar/AppNavbar"
import { useMinWidthMedia } from "../../hooks/useMedia"

type AppLayoutProps = {
	children?: React.ReactNode
}

export default function AppLayout(props: AppLayoutProps) {

	const renderAppNavbar = useMinWidthMedia(600)

	return <div className={styles.root}>
		{renderAppNavbar ? <AppNavbar /> : null}
		<AppTabs />
		<div className={styles.childrenContainer}>
			{props.children}
		</div>
	</div>
}
