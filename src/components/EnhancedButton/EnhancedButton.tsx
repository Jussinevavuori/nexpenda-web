import "./EnhancedButton.scss";
import React from "react"
import { Button, ButtonBaseProps, ButtonProps, CircularProgress } from "@material-ui/core";

export type EnhancedButtonProps<C> = {
	loading?: boolean;
	component?: C;
} & ButtonProps & ButtonBaseProps

export function EnhancedButton<C extends React.ElementType>(props: EnhancedButtonProps<C>) {

	const { loading, disabled, children, ...buttonProps } = props

	return <div className="EnhancedButton">
		<Button
			{...buttonProps}
			disabled={disabled || loading}
		>
			{children}
			{
				loading ? <>
					<CircularProgress />
				</> : null
			}
		</Button>
	</div>
}