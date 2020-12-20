import React from "react"
import { Switch, Route, Redirect } from 'react-router-dom';
import { Login } from './views/Login/Login';
import { Register } from './views/Register/Register';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRouteController';
import { Dashboard } from './views/Dashboard/Dashboard';
import { Settings } from "./views/Settings/SettingsController";
import { Analytics } from "./views/Analytics/AnalyticsController";
import { ForgotPassword } from "./views/ForgotPassword/ForgotPassword";
import { AppFrame } from "./components/AppFrame/AppFrame";
import { ChangePassword } from "./views/ChangePassword/ChangePassword";
import { ConfirmEmail } from "./views/ConfirmEmail/ConfirmEmail";
import { Budget } from "./views/Budget/BudgetController";
import { AuthFrame } from "./components/AuthFrame/AuthFrame";

export const routes = {
	approot: "/app",
	dashboard: "/app/dashboard",
	analytics: "/app/analytics",
	budget: "/app/budget",
	settings: "/app/settings",
	login: "/",
	forgotPassword: "/forgotPassword",
	register: "/register",
	changePassword(token: string) {
		return `/changePassword/${token}`
	},
	confirmEmail(token: string) {
		return `/confirmEmail/${token}`
	}
} as const;

export function Routes() {

	return <Switch>

		<Route exact path={routes.login}>
			<AuthFrame>
				<Login />
			</AuthFrame>
		</Route>

		<Route exact path={routes.register}>
			<AuthFrame>
				<Register />
			</AuthFrame>
		</Route>

		<Route exact path={routes.forgotPassword}>
			<AuthFrame>
				<ForgotPassword />
			</AuthFrame>
		</Route>

		<Route exact path={routes.changePassword(":token")}>
			<AuthFrame>
				<ChangePassword />
			</AuthFrame>
		</Route>

		<Route exact path={routes.confirmEmail(":token")}>
			<AuthFrame>
				<ConfirmEmail />
			</AuthFrame>
		</Route>

		<ProtectedRoute exact path={routes.dashboard}>
			<AppFrame>
				<Dashboard />
			</AppFrame>
		</ProtectedRoute>

		<ProtectedRoute exact path={routes.analytics}>
			<AppFrame>
				<Analytics />
			</AppFrame>
		</ProtectedRoute>

		<ProtectedRoute exact path={routes.budget}>
			<AppFrame>
				<Budget />
			</AppFrame>
		</ProtectedRoute>

		<ProtectedRoute exact path={routes.settings}>
			<AppFrame>
				<Settings />
			</AppFrame>
		</ProtectedRoute>

		<Route path="/">
			<Redirect to={routes.dashboard} />
		</Route>
	</Switch>

}