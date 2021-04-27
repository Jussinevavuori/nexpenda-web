import "./ChangeIcon.scss";
import cx from "classnames";
import { ArrowDownward, ArrowUpward, Remove } from "@material-ui/icons";

export type ChangeIconProps = {
	change?: number;
	color?: Color | {
		positive: Color;
		negative: Color;
		neutral: Color;
	};
};

export function ChangeIcon(props: ChangeIconProps) {

	const changeType = !props.change
		? "neutral"
		: props.change > 0
			? "positive"
			: "negative"

	const color = props.color
		? typeof props.color === "string"
			? props.color
			: props.color[changeType]
		: "gray-800"

	const className = cx(
		"ChangeIcon",
		`color-${color}`,
		`change-${changeType}`
	)

	switch (changeType) {
		case "neutral":
			return <Remove className={className} />
		case "positive":
			return <ArrowUpward className={className} />
		case "negative":
			return <ArrowDownward className={className} />
	}

}