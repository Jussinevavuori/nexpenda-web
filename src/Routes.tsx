import React from "react"
import { Switch, Route, Link, Redirect } from 'react-router-dom';
import { LoginController } from './components/Login/LoginController';
import { RegisterController } from './components/Register/RegisterController';
import AppLayout from './components/AppLayout/AppLayout';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import HomeScreen from './views/HomeScreen/HomeScreenView';

function Navigation() {
	return <nav style={{ margin: "0 0 16px 0", display: "flex", flexDirection: "row", height: 40, background: "#204aa5", width: "100%", alignItems: "center" }}>
		<Link to={routes.login} style={{ color: "white", margin: "0 8px" }}>Login</Link>
		<Link to={routes.register} style={{ color: "white", margin: "0 8px" }}>Register</Link>
	</nav>
}

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
			<Navigation />
			<LoginController />
		</Route>
		<Route exact path={routes.register}>
			<Navigation />
			<RegisterController />
		</Route>

		<ProtectedRoute exact path={routes.dashboard}>
			<AppLayout>
				<HomeScreen />
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