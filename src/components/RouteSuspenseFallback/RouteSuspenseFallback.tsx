import "./RouteSuspenseFallback.scss";
import cx from "classnames";
// import { useRouteSuspenseFallbackController } from "./useRouteSuspenseFallbackController";
import { CircularProgress } from "@material-ui/core";

export type RouteSuspenseFallbackProps = {

};

export function RouteSuspenseFallback(props: RouteSuspenseFallbackProps) {
	// const controller = useRouteSuspenseFallbackController(props)

	return <div className={cx("RouteSuspenseFallback")}>
		<CircularProgress />
	</div>
}