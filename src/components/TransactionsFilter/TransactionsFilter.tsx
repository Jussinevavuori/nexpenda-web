import "./TransactionsFilter.scss";
import React, { useRef } from "react"
import cx from "classnames"
import { Search as FilterIcon, Clear as CloseIcon } from "@material-ui/icons"
import { ButtonBase } from "@material-ui/core";
import { useMdMedia } from "../../hooks/utils/useMedia";
import { useTransactionsFilterController } from "./useTransactionsFilterController"
import { Type } from "../Type/Type";
import { AnimatePresence, AnimateSharedLayout, motion } from "framer-motion";
import { useTrueAfterTimeout } from "../../hooks/utils/useTrueAfterTimeout";

export type TransactionsFilterProps = {

}

export function TransactionsFilter(props: TransactionsFilterProps) {

	const trueAfterTimeout = useTrueAfterTimeout(100)
	const controller = useTransactionsFilterController(props)
	const isDesktopLayout = useMdMedia()

	const inputRef = useRef<HTMLInputElement | null>(null)

	return <div className="TransactionsFilter">
		<AnimateSharedLayout>
			<motion.div
				layout={trueAfterTimeout}
				className={cx("container", { open: controller.open })}
			>
				<ButtonBase
					focusRipple
					disableRipple={controller.open}
					className={cx({ open: controller.open })}
					onClick={() => {
						if (!controller.open) {
							controller.onOpen()
						}
						setTimeout(() => {
							inputRef.current?.focus()
						}, 0)
					}}
				>
					<motion.div
						layout={trueAfterTimeout}
						className={cx("buttonBase", { open: controller.open })}
					>
						<motion.span
							className="icon startIcon"
							layout={trueAfterTimeout ? "position" : false}
						>
							<FilterIcon />
						</motion.span>
						<AnimatePresence>
							{
								(!controller.open && isDesktopLayout) && <motion.span
									transition={{ duration: 0.4 }}
									layout="position"
									initial={{ opacity: 0, scale: 1 }}
									animate={{ opacity: 1, scale: 1 }}
									exit={{ opacity: 0, scale: 0 }}
								>
									<Type variant="boldcaps" >
										{"Search"}
									</Type>
								</motion.span>
							}
						</AnimatePresence>
						{
							controller.open && <motion.span
								className={cx("inputContainer", { open: controller.open })}
								layout={trueAfterTimeout ? "position" : false}
								initial={{ opacity: 0, scale: 0 }}
								animate={{ opacity: 1, scale: 1 }}
								exit={{ opacity: 0, scale: 0 }}
							>
								<input
									ref={inputRef}
									className="input"
									value={controller.input}
									onChange={(e) => controller.setInput(e.target.value)}
								/>
							</motion.span>
						}
						{
							controller.open && <motion.span
								transition={{ duration: 0.4 }}
								initial={{ opacity: 0, y: -10 }}
								animate={{ opacity: 1, y: 0 }}
								className="icon endIcon iconButton"
								layout={trueAfterTimeout ? "position" : false}
							>
								<div className="iconButtonChild">
									<CloseIcon
										onClick={e => {
											e.stopPropagation()
											controller.onClose()
										}}
									/>
								</div>
							</motion.span>
						}
					</motion.div>
				</ButtonBase>
			</motion.div>
		</AnimateSharedLayout>
	</div>
}