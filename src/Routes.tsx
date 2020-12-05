import React from "react"
import { Switch, Route, Redirect } from 'react-router-dom';
import { Login } from './views/Login/LoginController';
import { Register } from './views/Register/RegisterController';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRouteController';
import { Dashboard } from './views/Dashboard/DashboardController';
import { Settings } from "./views/Settings/SettingsController";
import { Analytics } from "./views/Analytics/AnalyticsController";
import { ForgotPassword } from "./views/ForgotPassword/ForgotPasswordController";
import { AppFrame } from "./components/AppFrame/AppFrameController";
import { ChangePassword } from "./views/ChangePassword/ChangePasswordController";
import { ConfirmEmail } from "./views/ConfirmEmail/ConfirmEmailController";
import { Budget } from "./views/Budget/BudgetController";

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
			<Login />
		</Route>

		<Route exact path={routes.register}>
			<Register />
		</Route>

		<Route exact path={routes.forgotPassword}>
			<ForgotPassword />
		</Route>

		<Route exact path={routes.changePassword(":token")}>
			<ChangePassword />
		</Route>

		<Route exact path={routes.confirmEmail(":token")}>
			<ConfirmEmail />
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