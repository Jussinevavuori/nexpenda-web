import React from "react";
import { makeStyles, Typography } from "@material-ui/core";
import { useStoreState } from "../../store";

export type HomeScreenViewProps = {}

export default function HomeScreenView(props: HomeScreenViewProps) {

	const styles = useStyles()

	const user = useStoreState(_ => _.authentication.user)

	if (!user) return null

	return <div className={styles.root}>

		<header className={styles.header}>

			<Typography className={styles.headerTitle}>
				{`Welcome back, ${user.displayName}`}
			</Typography>

		</header>

		<section>

			<Typography>
				{`Your transactions this month`}
			</Typography>

		</section>

	</div>

}

const useStyles = makeStyles(theme => ({

	root: {
	},

	header: {
		height: 320,
		width: "100%",
		background: theme.palette.primary.main,
		padding: theme.spacing(2),

		"& *": {
			color: "#ffffff",
		}
	},

	headerTitle: {

		fontSize: theme.typography.fontSize * 1.5,
		fontWeight: theme.typography.fontWeightBold,

	}

}))