import React from "react"
import AppTabs from "../AppTabs/AppTabs"
import { makeStyles } from "@material-ui/core"
import cx from "classnames"

type AppLayoutProps = {
	children?: React.ReactNode
}

export default function AppLayout(props: AppLayoutProps) {

	const styles = useStyles()

	return <div className={cx("AppLayout", styles.root)}>
		<AppTabs />
		<div className={styles.childrenContainer}>
			{props.children}
		</div>
	</div>
}

const useStyles = makeStyles(theme => ({
	root: {
		overflow: "hidden",
		width: "100%",
		height: "100vh",
		maxWidth: "100%",
		maxHeight: "100vh",

		background: "white",//theme.palette.grey[200],

		display: "grid",

		gridTemplateRows: "auto 60px",
		gridTemplateColumns: "1fr",
		gridTemplateAreas: "\"children\" \"navbar\"",

		"& .AppTabs": {
			gridArea: "navbar",
		},
	},

	childrenContainer: {
		gridArea: "children",
		height: "100%",
		width: "100%",
		overflow: "auto",
	}
}))