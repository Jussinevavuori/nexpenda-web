import { useGtagTracking } from "../../hooks/gtag/useGtagTracking";
import { useVhFix } from "../../hooks/utils/useVhFix";
import { useHistoryNotifications } from "../../hooks/application/useHistoryNotifications";
import { useApplicationShortcuts } from "../../hooks/shortcuts/useApplicationShortcuts";
import { useInitializeData } from "../../hooks/application/useInitializeData";
import { useForceInterval } from "../../hooks/application/useForceInterval";
import { usePathTitle } from "../../hooks/application/usePathTitle";
import { useNotifyOnNetworkFailure } from "../../hooks/network/useNotifyOnNetworkFailure";
import { useBlockCreation } from "../../hooks/application/useBlockCreation";

/**
 * The purpose of the HooksRoot component is to call all required "global"
 * application hooks from the "root" of the application without having to
 * rerender the real application root.
 */
export function HooksRoot() {
	// Enable Gtag tracking
	useGtagTracking()

	// CSS utility for fullscreen (especially on mobile)
	useVhFix()

	// Enable history notifications
	useHistoryNotifications()

	// Enable all application shortcuts
	useApplicationShortcuts()

	// Initialize application data by instantly fetching the profile and 
	// transactions
	useInitializeData()

	// Apply forced or disabledd intervals
	useForceInterval()

	// Sync the current path title
	usePathTitle()

	// Network failure notifications
	useNotifyOnNetworkFailure()

	// Block creating new items when limits exceeded
	useBlockCreation()

	return null
}
