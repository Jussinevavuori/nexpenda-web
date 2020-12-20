import "./AuthFrame.scss";
import React from "react"
import { Logo } from "../Logo/Logo";
import { Button } from "@material-ui/core";
import { useAuthFrameController } from "./useAuthFrameController";

export type AuthFrameProps = {
	children?: React.ReactNode;
}

export function AuthFrame(props: AuthFrameProps) {

	const controller = useAuthFrameController()

	return <div className="AuthFrame">

		<nav>
			<Logo />
			{
				controller.handlePwaInstall
					? <Button
						color="primary"
						variant="contained"
						onClick={controller.handlePwaInstall}
					>
						{"Install"}
					</Button>
					: <Button
						color="primary"
						variant="text"
					>
						{"Unavailable"}
					</Button>
			}
		</nav>

		<div className="content">{props.children}</div>

	</div>
}