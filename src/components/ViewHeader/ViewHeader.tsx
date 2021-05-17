import "./ViewHeader.scss";
import textureImg from "../../assets/images/textureImage.jpg";
import React from "react";
import { createClassnames } from "../../utils/Utils/createClassnames";
import { Type } from "../Type/Type";

export type ViewHeaderProps = {

	/**
	 * ViewHeader children: if a string is provided, use a simple bottom-left
	 * aligned title. Else insert children into header as is.
	 */
	children?: string | React.ReactNode;

	/**
	 * Will the header be scrollable out of view with the panel sticking to the
	 * top of the screen?
	 */
	scrollable?: boolean;

};

export function ViewHeader(props: ViewHeaderProps) {

	const cx = createClassnames({ scrollable: props.scrollable })

	return <div className={cx("ViewHeader")}>

		<section>

			{/* Background texture */}
			<div className={cx("background")}>
				<img src={textureImg} alt="" />
			</div>

			{
				/* Render children. If children is a string, render as Type component. */
				props.children &&
				<div className={cx("content", { defaultTitle: typeof props.children === "string" })}>
					{
						typeof props.children === "string"
							? <Type
								className="title"
								component="h1"
								size="xl"
								color="white"
								variant="bold"
								children={props.children}
							/>
							: props.children
					}
				</div>
			}

		</section>
	</div>
}