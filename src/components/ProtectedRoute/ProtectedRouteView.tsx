import "./ProtectedRouteView.scss";
import textureImg from "../../images/pexels-johannes-plenio-1103970.jpg"
import React, { useCallback, useState } from "react"
import { Type } from "../Type/Type";
import { CircularProgress } from "@material-ui/core";
import { useInterval } from "../../hooks/utils/useInterval";

export type ProtectedRouteViewProps = {

}

export function ProtectedRouteView(props: ProtectedRouteViewProps) {

	/**
	 * Count down seconds since render
	 */
	const [seconds, setSeconds] = useState(0)

	const intervalHandler = useCallback(() => {
		setSeconds(_ => _ + 1)
	}, [setSeconds])

	useInterval(intervalHandler, 1000)

	return <div className="ProtectedRouteView">

		<img src={textureImg} alt="" className="texture" />

		<div className="content">

			<Type>
				{
					(() => {
						const key = Object.keys(messages)
							.reverse()
							.find(_ => Number(_) < seconds) as undefined | keyof typeof messages
						if (!key) {
							return "Loading..."
						}
						return messages[key]
					})()
				}
			</Type>

			<CircularProgress />

		</div>

	</div>
}

const messages = {
	5: "This may take some time...",
	10: "Waiting for server...",
	15: "The server is starting up..."
} 