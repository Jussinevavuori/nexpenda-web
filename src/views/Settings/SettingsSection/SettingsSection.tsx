import "./SettingsSection.scss";
import React from "react"
import cx from "classnames"
import { Type } from "../../../components/Type/Type";

export type SettingsSectionProps = {
	sectionTitle: string;
} & React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>

export function SettingsSection(props: SettingsSectionProps) {

	const { sectionTitle, className, ...divProps } = props

	return <section className={cx("SettingsSection", className)} {...divProps}>
		<div className="sectionTitle">
			<Type size="md" component="h2" variant="bold" color="gray-500">
				{props.sectionTitle}
			</Type>
		</div>
		<div className="content">
			{props.children}
		</div>
	</section>
}