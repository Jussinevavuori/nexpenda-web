import "./ButtonTextFieldGroup.scss";
import React from "react";
import cx from "classnames";

export type ButtonTextFieldGroupProps = {
} & React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>;

export function ButtonTextFieldGroup(props: ButtonTextFieldGroupProps) {

	const { className, children, ...divProps } = props

	const totalChildren = React.Children.count(children)

	return <div
		{...divProps}
		className={cx("ButtonTextFieldGroup", className)}
	>
		{
			/**
			 * Add class names to first and last elements
			 */
			React.Children.map(children, (child, i) => {
				if (child && typeof child === "object" && "props" in child && "type" in child && "key" in child) {
					return React.cloneElement(child, {
						className: cx(child.props["className"], {
							"ButtonTextFieldGroup__first": i === 0,
							"ButtonTextFieldGroup__last": i === totalChildren - 1,
							"ButtonTextFieldGroup__hasNext": i < totalChildren - 1,
							"ButtonTextFieldGroup__hasPrevious": i > 0
						})
					})
				}

				return child
			})
		}
	</div>
}