import styles from "./IconButton.module.css";
import React from "react";

export type IconButtonProps = {
	children: React.ReactNode;
} & React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>

export default function IconButton(props: IconButtonProps) {
	const { children, ...buttonProps } = props
	return <button {...buttonProps} className={styles.root}>
		{children}
	</button>
}