import "./EnhancedButton.scss";
import React, { forwardRef } from "react"
import cx from "classnames"
import { Button, ButtonBaseProps, ButtonProps, CircularProgress } from "@material-ui/core";

export type EnhancedButtonProps = {
	loading?: boolean;
	component?: React.ElementType;
} & ButtonProps & ButtonBaseProps

export const EnhancedButton = forwardRef<HTMLButtonElement, EnhancedButtonProps>((props, ref) => {

	const { loading, disabled, children, className, ...buttonProps } = props

	return <Button
		{...buttonProps}
		ref={ref}
		className={cx("EnhancedButton", className)}
		disabled={disabled || loading}
	>
		{children}
		{
			loading &&
			<div className="enhancedButtonLoader">
				<CircularProgress size={28} />
			</div>
		}
	</Button>
})