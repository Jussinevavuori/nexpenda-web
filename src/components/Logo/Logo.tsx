import "./Logo.scss";
import React from "react"
import cx from "classnames"
import { TypeProps } from "../Type/Type";

export type LogoProps = {
	size?: TypeProps["size"];
} & React.DetailedHTMLProps<React.HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>

export function Logo(props: LogoProps) {

	const { className, size, ...spanProps } = props

	return <span
		className={cx("Logo", className, `size-${size}`)}
		{...spanProps}
	>
		<span className="letter-1">E</span>
		<span className="letter-2">x</span>
		<span className="letter-3">p</span>
		<span className="letter-4">e</span>
		<span className="letter-5">n</span>
		<span className="letter-6">c</span>
		<span className="letter-7">e</span>
		<span className="letter-8">.</span>
	</span>
}