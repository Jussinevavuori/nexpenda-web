import "./AuthFrame.scss";
import React from "react"
import { Type } from "../Type/Type";
import { Divider } from "@material-ui/core";

export type AuthFrameProps = {
	header: string;
	body: React.ReactNode;
	footer?: React.ReactNode;
}

export function AuthFrame(props: AuthFrameProps) {
	return <div className="AuthFrame">

		<div className="container">

			<header>

				<Type variant="h5" component="h1" color="white">
					{props.header}
				</Type>

			</header>

			<div className="content">

				{props.body}

				{

					props.footer
						? <>

							<Divider />

							<footer>

								{props.footer}

							</footer>

						</>
						: null

				}

			</div>

		</div>

	</div>
}