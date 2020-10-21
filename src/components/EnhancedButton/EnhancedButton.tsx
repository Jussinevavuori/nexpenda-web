import "./EnhancedButton.scss";
import React from "react"
import cx from "classnames"
import { Button, ButtonBaseProps, ButtonProps, CircularProgress } from "@material-ui/core";

export type EnhancedButtonProps<C> = {
	loading?: boolean;
	component?: C;
} & ButtonProps & ButtonBaseProps

export function EnhancedButton<C extends React.ElementType>(props: EnhancedButtonProps<C>) {

	const { loading, disabled, children, className, ...buttonProps } = props

	return <Button
		{...buttonProps}
		className={cx("EnhancedButton", className)}
		disabled={disabled || loading}
	>
		{children}
		{
			loading ? <div className="enhancedButtonLoader">
				<CircularProgress
					size={28}
				/>
			</div> : null
		}
	</Button>
}