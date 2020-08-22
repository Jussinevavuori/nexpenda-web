import React from "react"
import { Switch, Route, Redirect } from 'react-router-dom';
import { LoginController } from './views/Login/LoginController';
import { RegisterController } from './views/Register/RegisterController';
import AppLayout from './components/AppLayout/AppLayout';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import Dashboard from './views/Dashboard/DashboardView';

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
				<Dashboard />
			</AppLayout>
		</ProtectedRoute>

		<ProtectedRoute exact path={routes.analytics}>
			<AppLayout>
				<p>Analytics placeholder</p>
			</AppLayout>
		</ProtectedRoute>

		<ProtectedRoute exact path={routes.budget}>
			<AppLayout>
				<p>Budget placeholder</p>
			</AppLayout>
		</ProtectedRoute>

		<ProtectedRoute exact path={routes.settings}>
			<AppLayout>
				<p>Settings placeholder</p>
			</AppLayout>
		</ProtectedRoute>

		<Route path="/">
			<Redirect to={routes.dashboard} />
		</Route>
	</Switch>

}