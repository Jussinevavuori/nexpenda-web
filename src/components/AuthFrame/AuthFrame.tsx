import "./AuthFrame.scss";
import React from "react"
import { Logo } from "../Logo/Logo";
import { Button } from "@material-ui/core";
import { useAuthFrameController } from "./useAuthFrameController";
import { GetApp } from "@material-ui/icons";

export type AuthFrameProps = {
	children?: React.ReactNode;
}

export function AuthFrame(props: AuthFrameProps) {

	const controller = useAuthFrameController()

	return <div className="AuthFrame">
		<nav>
			<a href="https://nexpenda.com" target="_blank" rel="noreferrer noopener">
				<Logo showIcon />
			</a>
			{
				controller.handlePwaInstall &&
				<Button
					color="primary"
					variant="contained"
					onClick={controller.handlePwaInstall}
					startIcon={<GetApp />}
				>
					{"Install Nexpenda"}
				</Button>
			}
		</nav>

		<div className="content">{props.children}</div>
	</div>
}