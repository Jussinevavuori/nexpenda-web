import React from "react"
import { Switch, Route, Redirect } from 'react-router-dom';
import { Login } from './views/Login/LoginController';
import { Register } from './views/Register/RegisterController';
import AppLayout from './components/AppLayout/AppLayout';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import { DashboardTab } from './views/DashboardTab/DashboardTabController';
import { SettingsTab } from "./views/SettingsTab/SettingsTabController";
import { AnalyticsTab } from "./views/AnalyticsTab/AnalyticsTabController";
import { ForgotPassword } from "./views/ForgotPassword/ForgotPasswordController";

export const routes = {
	approot: "/app",
	dashboard: "/app/dashboard",
	analytics: "/app/analytics",
	budget: "/app/budget",
	settings: "/app/settings",
	login: "/",
	forgotPassword: "/forgotPassword",
	register: "/register",
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

		<ProtectedRoute exact path={routes.dashboard}>
			<AppLayout>
				<DashboardTab />
			</AppLayout>
		</ProtectedRoute>

		<ProtectedRoute exact path={routes.analytics}>
			<AppLayout>
				<AnalyticsTab />
			</AppLayout>
		</ProtectedRoute>

		<ProtectedRoute exact path={routes.budget}>
			<AppLayout>
				<p>Budget placeholder</p>
			</AppLayout>
		</ProtectedRoute>

		<ProtectedRoute exact path={routes.settings}>
			<AppLayout>
				<SettingsTab />
			</AppLayout>
		</ProtectedRoute>

		<Route exact path="/v">
			Version number 0.0.1
		</Route>

		<Route path="/">
			<Redirect to={routes.dashboard} />
		</Route>
	</Switch>

}