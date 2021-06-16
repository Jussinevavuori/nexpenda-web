import { lazy, Suspense } from "react"
import { Switch, Route, Redirect } from 'react-router-dom';
import { ProtectedRoute } from './components/ProtectedRoute/ProtectedRoute';
import { AuthFrame } from "./components/AuthFrame/AuthFrame"
import { AppFrame } from "./components/AppFrame/AppFrame"
import { RouteSuspenseFallback } from "./components/RouteSuspenseFallback/RouteSuspenseFallback";
import { RouteData } from "./classes/RouteData";
const Login = lazy(() => import("./views/Login/Login").then(_ => ({ default: _.Login })))
const Register = lazy(() => import('./views/Register/Register').then(_ => ({ default: _.Register })))
const Dashboard = lazy(() => import('./views/Dashboard/Dashboard').then(_ => ({ default: _.Dashboard })))
const Settings = lazy(() => import("./views/Settings/Settings").then(_ => ({ default: _.Settings })))
const Analytics = lazy(() => import("./views/Analytics/Analytics").then(_ => ({ default: _.Analytics })))
const ForgotPassword = lazy(() => import("./views/ForgotPassword/ForgotPassword").then(_ => ({ default: _.ForgotPassword })))
const ChangePassword = lazy(() => import("./views/ChangePassword/ChangePassword").then(_ => ({ default: _.ChangePassword })))
const ConfirmEmail = lazy(() => import("./views/ConfirmEmail/ConfirmEmail").then(_ => ({ default: _.ConfirmEmail })))
const Budgets = lazy(() => import("./views/Budgets/Budgets").then(_ => ({ default: _.Budgets })))
const Logout = lazy(() => import("./views/Logout/Logout").then(_ => ({ default: _.Logout })))
const Subscribe = lazy(() => import("./views/Subscribe/Subscribe").then(_ => ({ default: _.Subscribe })))
const SubscribeSuccess = lazy(() => import("./views/SubscribeSuccess/SubscribeSuccess").then(_ => ({ default: _.SubscribeSuccess })))

export type VariableRouteData = (s: string) => RouteData

export const routes = {
	approot: new RouteData({
		name: "approot",
		path: "/app",
		title: ""
	}),
	dashboard: new RouteData({
		name: "dashboard",
		path: "/app/dashboard",
		title: "Dashboard"
	}),
	analytics: new RouteData({
		name: "analytics",
		path: "/app/analytics",
		title: "Analytics",
		// disabledIntervalLengths: ["all"],
	}),
	budgets: new RouteData({
		name: "budgets",
		path: "/app/budgets",
		title: "Budgets",
		disabledIntervalLengths: ["all"],
	}),
	settings: new RouteData({
		name: "settings",
		path: "/app/settings",
		title: "Settings"
	}),
	login: new RouteData({
		name: "login",
		path: "/",
		title: "Login"
	}),
	forgotPassword: new RouteData({
		name: "forgotPassword",
		path: "/forgotPassword",
		title: "Forgot Password"
	}),
	register: new RouteData({
		name: "register",
		path: "/register",
		title: "Register"
	}),
	logOut: new RouteData({
		name: "logOut",
		path: "/logout",
		title: "Log out"
	}),
	subscribe: new RouteData({
		name: "subscribe",
		path: "/subscribe",
		title: "Subscribe"
	}),
	subscribeCanceled: new RouteData({
		name: "subscribeCanceled",
		path: "/subscribe/cancel",
		title: "Subscription canceled"
	}),
	subscribeSuccess: new RouteData({
		name: "subscribeSuccess",
		path: "/subscribe/success",
		title: "Succesfully subscribed"
	}),
	changePassword(token: string): RouteData {
		return new RouteData({
			name: "changePassword",
			path: `/changePassword/${token}`,
			title: "Change Password"
		})
	},
	confirmEmail(token: string): RouteData {
		return new RouteData({
			name: "confirmEmail",
			path: `/confirmEmail/${token}`,
			title: "Confirm Email"
		})
	}
} as const;

export function Routes() {

	return <Switch>

		<Route exact path={routes.login.path}>
			<AuthFrame>
				<Suspense fallback={<RouteSuspenseFallback />}>
					<Login />
				</Suspense>
			</AuthFrame>
		</Route>

		<Route exact path={routes.register.path}>
			<AuthFrame>
				<Suspense fallback={<RouteSuspenseFallback />}>
					<Register />
				</Suspense>
			</AuthFrame>
		</Route>

		<Route exact path={routes.forgotPassword.path}>
			<AuthFrame>
				<Suspense fallback={<RouteSuspenseFallback />}>
					<ForgotPassword />
				</Suspense>
			</AuthFrame>
		</Route>

		<Route exact path={routes.changePassword(":token").path}>
			<AuthFrame>
				<Suspense fallback={<RouteSuspenseFallback />}>
					<ChangePassword />
				</Suspense>
			</AuthFrame>
		</Route>

		<Route exact path={routes.confirmEmail(":token").path}>
			<AuthFrame>
				<Suspense fallback={<RouteSuspenseFallback />}>
					<ConfirmEmail />
				</Suspense>
			</AuthFrame>
		</Route>

		<Route exact path={routes.logOut.path}>
			<AuthFrame>
				<Suspense fallback={<RouteSuspenseFallback />}>
					<Logout />
				</Suspense>
			</AuthFrame>
		</Route>

		<ProtectedRoute exact path={routes.dashboard.path}>
			<AppFrame>
				<Suspense fallback={<RouteSuspenseFallback />}>
					<Dashboard />
				</Suspense>
			</AppFrame>
		</ProtectedRoute>

		<ProtectedRoute exact path={routes.analytics.path}>
			<AppFrame>
				<Suspense fallback={<RouteSuspenseFallback />}>
					<Analytics />
				</Suspense>
			</AppFrame>
		</ProtectedRoute>

		<ProtectedRoute exact path={routes.budgets.path}>
			<AppFrame>
				<Suspense fallback={<RouteSuspenseFallback />}>
					<Budgets />
				</Suspense>
			</AppFrame>
		</ProtectedRoute>

		<ProtectedRoute exact path={routes.settings.path}>
			<AppFrame>
				<Suspense fallback={<RouteSuspenseFallback />}>
					<Settings />
				</Suspense>
			</AppFrame>
		</ProtectedRoute>

		<ProtectedRoute exact path={routes.subscribe.path}>
			<Suspense fallback={<RouteSuspenseFallback />}>
				<Subscribe />
			</Suspense>
		</ProtectedRoute>

		<ProtectedRoute exact path={routes.subscribeCanceled.path}>
			<Suspense fallback={<RouteSuspenseFallback />}>
				<Subscribe cancelled />
			</Suspense>
		</ProtectedRoute>

		<ProtectedRoute exact path={routes.subscribeSuccess.path}>
			<Suspense fallback={<RouteSuspenseFallback />}>
				<SubscribeSuccess />
			</Suspense>
		</ProtectedRoute>

		<Route path="/">
			<Redirect to={routes.dashboard.path} />
		</Route>

	</Switch>

}