import React from "react"
import { Switch, Route, Redirect } from 'react-router-dom';
import { LoginController } from './views/Login/LoginController';
import { RegisterController } from './views/Register/RegisterController';
import AppLayout from './components/AppLayout/AppLayout';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import { DashboardTab } from './views/DashboardTab/DashboardTabController';
import { SettingsTab } from "./views/SettingsTab/SettingsTabController";
import { AnalyticsTab } from "./views/AnalyticsTab/AnalyticsTabController";

export const routes = {
	approot: "/app",
	dashboard: "/app/dashboard",
	analytics: "/app/analytics",
	budget: "/app/budget",
	settings: "/app/settings",
	login: "/",
	register: "/register",
} as const;

export function Routes() {

	return <Switch>

		<Route exact path={routes.login}>
			<LoginController />
		</Route>

		<Route exact path={routes.register}>
			<RegisterController />
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