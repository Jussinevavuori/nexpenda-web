import styles from "./Modal.module.css";
import React, { useCallback } from "react";
import { createPortal } from "react-dom"
import { useOnKeyPress } from "../../hooks/useOnKeyPress";

export type ModalProps = {
	open: boolean;
	onClose: Function;
	children: React.ReactNode;

	disableBackgroundClick?: boolean;
	disableEsc?: boolean;
}

const portalElement = document.getElementById("_modal")

export function Modal(props: ModalProps) {

	/**
	 * Unless disabled, pressing ESC will close the modal
	 */
	const onEscKeyPressed = useCallback(() => {
		if (!props.disableEsc) {
			props.onClose()
		}
	}, [props.disableEsc, props.onClose])
	useOnKeyPress(27, onEscKeyPressed, { if: props.open })

	/**
	 * Unless disabled, clicking the background will close the modal
	 */
	const handleBackgroundClick = useCallback(() => {
		if (!props.disableBackgroundClick) {
			props.onClose()
		}
	}, [props.disableBackgroundClick, props.onClose])

	/**
	 * Ensure portal element exists
	 */
	if (!portalElement) throw Error("Portal element not defined for modal")

	/**
	 * Show only if props are open
	 */
	if (!props.open) return null

	/**
	 * Render modal in portal
	 */
	return createPortal(
		<div className={styles.root}>
			<div className={styles.background} onClick={handleBackgroundClick} />
			<div className={styles.modal}>
				<div className={styles.modalContent}>
					{props.children}
				</div>
			</div>
		</div>,
		portalElement
	)
}