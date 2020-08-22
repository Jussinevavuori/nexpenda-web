import styles from "./AppNavbar.module.css"
import React from "react"
import { User as UserIcon, LogOut as LogOutIcon } from "react-feather"
import { useStoreState, useStoreActions } from "../../store"
import IconButton from "../IconButton/IconButton"

export default function AppNavbar() {

	const user = useStoreState(_ => _.auth.user)

	const logOut = useStoreActions(_ => _.auth.logOut)

	if (!user) return null

	return <nav className={styles.root}>

		<div className={styles.logo}>
			<span>
				{"Expence"}
			</span>
		</div>

		<div className={styles.user}>
			<UserIcon />
			<span>
				{`Logged in as ${user.displayName}`}
			</span>
			<IconButton onClick={() => logOut()}>
				<LogOutIcon />
			</IconButton>
		</div>

	</nav>

}