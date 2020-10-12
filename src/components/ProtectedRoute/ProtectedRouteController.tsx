import React from "react";
import { Route, RouteProps, Redirect } from "react-router-dom";
import { useStoreState } from "../../store";
import { routes } from "../../Routes";
import { ProtectedRouteViewView } from "./ProtectedRouteView";

export type ProtectedRouteProps = {
	fallbackRoute?: string;
} & RouteProps

export default function ProtectedRoute(props: ProtectedRouteProps) {

	const { fallbackRoute, ...routeProps } = props

	/**
	 * Default fallback to login on redirect
	 */
	const defaultFallbackRoute = routes.login

	/**
	 * Get current user details
	 */
	const initialized = useStoreState(_ => _.auth.initialized)
	const isLoggedIn = useStoreState(_ => _.auth.isLoggedIn)

	/**
	 * If the user is being loaded, show nothing
	 */
	if (!initialized) return <ProtectedRouteViewView />

	/**
	 * Else if user is not logged in redirect to fallback route or default fallback route
	 * if none specified in props
	 */
	else if (!isLoggedIn) return <Redirect to={fallbackRoute || defaultFallbackRoute} />

	/**
	 * Else return route as is
	 */
	else return <Route {...routeProps} />
}