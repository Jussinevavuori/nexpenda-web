import "./ClearableErrorDialog.scss";
import React from "react";
import cx from "classnames";
// import { useClearableErrorDialogController } from "./useClearableErrorDialogController";
import { Type } from "../Type/Type";
import { IconButton } from "@material-ui/core";
import { Clear } from "@material-ui/icons";
import { motion, AnimatePresence } from "framer-motion";

export type ClearableErrorDialogProps = {
	title: string;
	open: boolean;
	onClose(): void;
	children?: React.ReactNode;
};

export function ClearableErrorDialog(props: ClearableErrorDialogProps) {
	// const controller = useClearableErrorDialogController(props)

	return <AnimatePresence>
		{
			props.open && <motion.div
				className={cx("ClearableErrorDialog")}
				exit={{ opacity: 0, scale: 0.5 }}
				initial={{ opacity: 0, scale: 0.5 }}
				animate={{ opacity: 1, scale: 1 }}
			>
				<header>
					<Type component="p" color="red-800" variant="bold">
						{"Subscription checkout canceled"}
					</Type>
					<IconButton onClick={props.onClose}>
						<Clear />
					</IconButton>
				</header>
				<div className="content">
					{props.children}
				</div>
			</motion.div>
		}
	</AnimatePresence>
}