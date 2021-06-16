import { useGtagTracking } from "../../hooks/gtag/useGtagTracking";
import { useVhFix } from "../../hooks/utils/useVhFix";
import { useHistoryNotifications } from "../../hooks/application/useHistoryNotifications";
import { useApplicationShortcuts } from "../../hooks/shortcuts/useApplicationShortcuts";
import { useInitializeData } from "../../hooks/application/useInitializeData";
import { useForceInterval } from "../../hooks/application/useForceInterval";
import { usePathTitle } from "../../hooks/application/usePathTitle";
import { useNotifyOnNetworkFailure } from "../../hooks/network/useNotifyOnNetworkFailure";
import { useBlockCreation } from "../../hooks/application/useBlockCreation";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";

/**
 * List of all hook components
 */
const HookComponents = [
	/**
	 * Enable Gtag tracking
	 */
	function HookComponent__useGtagTracking() {
		useGtagTracking()
		return null
	},

	/**
	 * CSS utility for fullscreen (especially on mobile)
	 */
	function HookComponent__useVhFix() {
		useVhFix()
		return null
	},

	/**
	 * Enable history notifications
	 */
	function HookComponent__useHistoryNotifications() {
		useHistoryNotifications()
		return null
	},

	/**
	 * Enable all application shortcuts
	 */
	function HookComponent__useApplicationShortcuts() {
		useApplicationShortcuts()
		return null
	},

	/**
	 * Initialize application data by instantly fetching the profile and 
	 * transactions
	 */
	function HookComponent__useInitializeData() {
		useInitializeData()
		return null
	},

	/**
	 * Apply forced or disabledd intervals
	 */
	function HookComponent__useForceInterval() {
		useForceInterval()
		return null
	},

	/**
	 * Sync the current path title
	 */
	function HookComponent__usePathTitle() {
		usePathTitle()
		return null
	},

	/**
	 * Network failure notifications
	 */
	function HookComponent__useNotifyOnNetworkFailure() {
		useNotifyOnNetworkFailure()
		return null
	},

	/**
	 * Block creating new items when limits exceeded
	 */
	// Block creating new items when limits exceeded
	function HookComponent__useBlockCreation() {
		useBlockCreation()
		return null
	},
] as const

/**
 * The purpose of the HooksRoot component is to call all required "global"
 * application hooks from the "root" of the application without having to
 * rerender the real application root.
 */
export function HooksRoot() {

	const location = useLocation();
	useEffect(() => {
		console.log(location.state)
	}, [location])

	return <>
		{
			HookComponents.map((Component, index) => <Component key={index} />)
		}
	</>
}
