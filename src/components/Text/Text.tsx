import "./Text.scss";
import React from "react";
import cx from "classnames"

export type TextWeight = "default" | "bold" | "light"

export type TextColor = "primary" | "default" | "white" | "black"

export type TextPadding = "none" | "xs" | "sm" | "md" | "lg" | "xl"

export interface AdditionalTextProps {
	error?: true;
	weight?: TextWeight;
	color?: TextColor;
	padding?: TextPadding;
}

export type HTMLHeadingProps = React.DetailedHTMLProps<React.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>
export type HTMLParagraphProps = React.DetailedHTMLProps<React.HTMLAttributes<HTMLParagraphElement>, HTMLParagraphElement>
export type HTMLSpanProps = React.DetailedHTMLProps<React.HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>

export type TextHeaderProps = AdditionalTextProps & HTMLHeadingProps
export type TextParagraphProps = AdditionalTextProps & HTMLParagraphProps
export type TextSpanProps = AdditionalTextProps & HTMLSpanProps

export type TextProps = TextHeaderProps
	| TextParagraphProps
	| TextSpanProps

/**
 * Construct a classname property from the given props
 */
function getClassName(defaultClassName: string, props: TextProps) {
	return cx(
		props.className,
		defaultClassName,
		{ clickable: !!props.onClick },
		{ error: !!props.error },
		`weight-${props.weight ?? "default"}`,
		`padding-${props.padding ?? "none"}`,
		`color-${props.color ?? "default"}`,
	)
}

function getHeaderHtmlProps(props: TextHeaderProps): HTMLHeadingProps {
	const { error, weight, color, padding, className, children, ...htmlProps } = props
	return htmlProps
}

function getParagraphHtmlProps(props: TextParagraphProps): HTMLParagraphProps {
	const { error, weight, color, padding, className, children, ...htmlProps } = props
	return htmlProps
}

function getSpanHtmlProps(props: TextSpanProps): HTMLSpanProps {
	const { error, weight, color, padding, className, children, ...htmlProps } = props
	return htmlProps
}

/**
 * All Text components are defined in this const
 */
export const Text = {

	/**
	 * All header components are listed here
	 */
	Header: {

		/**
		 * H1 Header Component
		 */
		H1(props: TextHeaderProps) {
			return <h1
				{...getHeaderHtmlProps(props)}
				className={getClassName("Text Header H1", props)}
			>{props.children}</h1>
		},


		/**
		 * H2 Header Component
		 */
		H2(props: TextHeaderProps) {
			return <h2
				{...getHeaderHtmlProps(props)}
				className={getClassName("Text Header H2", props)}
			>{props.children}</h2>
		},


		/**
		 * H3 Header Component
		 */
		H3(props: TextHeaderProps) {
			return <h3
				{...getHeaderHtmlProps(props)}
				className={getClassName("Text Header H3", props)}
			>{props.children}</h3>
		},


		/**
		 * H4 Header Component
		 */
		H4(props: TextHeaderProps) {
			return <h4
				{...getHeaderHtmlProps(props)}
				className={getClassName("Text Header H4", props)}
			>{props.children}</h4>
		},


		/**
		 * H5 Header Component
		 */
		H5(props: TextHeaderProps) {
			return <h5
				{...getHeaderHtmlProps(props)}
				className={getClassName("Text Header H5", props)}
			>{props.children}</h5>
		},


		/**
		 * H6 Header Component
		 */
		H6(props: TextHeaderProps) {
			return <h6
				{...getHeaderHtmlProps(props)}
				className={getClassName("Text Header H6", props)}
			>{props.children}</h6>
		},

	},

	/**
	 * Paragraph component
	 */
	Paragraph(props: TextParagraphProps) {
		return <p
			{...getParagraphHtmlProps(props)}
			className={getClassName("Text Paragraph", props)}
		>{props.children}</p>
	},

	/**
	 * Span component
	 */
	Span(props: TextSpanProps) {
		return <span
			{...getSpanHtmlProps(props)}
			className={getClassName("Text Span", props)}
		>{props.children}</span>
	},

} as const