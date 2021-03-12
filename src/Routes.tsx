import React from "react"
import { Switch, Route, Redirect } from 'react-router-dom';
import { Login } from './views/Login/Login';
import { Register } from './views/Register/Register';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import { Dashboard } from './views/Dashboard/Dashboard';
import { Settings } from "./views/Settings/Settings";
import { Analytics } from "./views/Analytics/Analytics";
import { ForgotPassword } from "./views/ForgotPassword/ForgotPassword";
import { AppFrame } from "./components/AppFrame/AppFrame";
import { ChangePassword } from "./views/ChangePassword/ChangePassword";
import { ConfirmEmail } from "./views/ConfirmEmail/ConfirmEmail";
import { Budget } from "./views/Budget/Budget";
import { AuthFrame } from "./components/AuthFrame/AuthFrame";
import { usePathTitle } from "./hooks/application/usePathTitle";
import { Logout } from "./views/Logout/Logout";
import { Subscribe } from "./views/Subscribe/Subscribe";
import { SubscribeSuccess } from "./views/SubscribeSuccess/SubscribeSuccess";

export type RouteData = {
	name: string,
	path: string,
	title: string,
}

export type VariableRouteData = (s: string) => RouteData

export const routes = {
	approot: {
		name: "approot",
		path: "/app",
		title: ""
	} as RouteData,
	dashboard: {
		name: "dashboard",
		path: "/app/dashboard",
		title: "Dashboard"
	} as RouteData,
	analytics: {
		name: "analytics",
		path: "/app/analytics",
		title: "Analytics"
	} as RouteData,
	budget: {
		name: "budget",
		path: "/app/budget",
		title: "Budget"
	} as RouteData,
	settings: {
		name: "settings",
		path: "/app/settings",
		title: "Settings"
	} as RouteData,
	login: {
		name: "login",
		path: "/",
		title: "Login"
	} as RouteData,
	forgotPassword: {
		name: "forgotPassword",
		path: "/forgotPassword",
		title: "Forgot Password"
	} as RouteData,
	register: {
		name: "register",
		path: "/register",
		title: "Register"
	} as RouteData,
	logOut: {
		name: "logOut",
		path: "/logout",
		title: "Log out"
	} as RouteData,
	subscribe: {
		name: "subscribe",
		path: "/subscribe",
		title: "Subscribe"
	},
	subscribeSuccess: {
		name: "subscribeSuccess",
		path: "/subscribe/success",
		title: "Succesfully subscribed"
	},
	changePassword(token: string): RouteData {
		return {
			name: "changePassword",
			path: `/changePassword/${token}`,
			title: "Change Password"
		}
	},
	confirmEmail(token: string): RouteData {
		return {
			name: "confirmEmail",
			path: `/confirmEmail/${token}`,
			title: "Confirm Email"
		}
	}
} as const;

export function Routes() {

	usePathTitle()

	return <Switch>

		<Route exact path={routes.login.path}>
			<AuthFrame>
				<Login />
			</AuthFrame>
		</Route>

		<Route exact path={routes.register.path}>
			<AuthFrame>
				<Register />
			</AuthFrame>
		</Route>

		<Route exact path={routes.forgotPassword.path}>
			<AuthFrame>
				<ForgotPassword />
			</AuthFrame>
		</Route>

		<Route exact path={routes.changePassword(":token").path}>
			<AuthFrame>
				<ChangePassword />
			</AuthFrame>
		</Route>

		<Route exact path={routes.confirmEmail(":token").path}>
			<AuthFrame>
				<ConfirmEmail />
			</AuthFrame>
		</Route>

		<Route exact path={routes.logOut.path}>
			<AuthFrame>
				<Logout />
			</AuthFrame>
		</Route>

		<ProtectedRoute exact path={routes.dashboard.path}>
			<AppFrame>
				<Dashboard />
			</AppFrame>
		</ProtectedRoute>

		<ProtectedRoute exact path={routes.analytics.path}>
			<AppFrame>
				<Analytics />
			</AppFrame>
		</ProtectedRoute>

		<ProtectedRoute exact path={routes.budget.path}>
			<AppFrame>
				<Budget />
			</AppFrame>
		</ProtectedRoute>

		<ProtectedRoute exact path={routes.settings.path}>
			<AppFrame>
				<Settings />
			</AppFrame>
		</ProtectedRoute>

		<ProtectedRoute exact path={routes.subscribe.path}>
			<Subscribe />
		</ProtectedRoute>

		<ProtectedRoute exact path={routes.subscribeSuccess.path}>
			<SubscribeSuccess />
		</ProtectedRoute>

		<Route path="/">
			<Redirect to={routes.dashboard.path} />
		</Route>
	</Switch>

}