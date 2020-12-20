import React, { useEffect } from 'react';
import { useVhFix } from './hooks/useVhFix';
import { Routes } from './Routes';
import { useStoreActions } from './store';
import { Notification } from "./components/Notification/NotificationController"
import { useHistoryNotifications } from './hooks/useHistoryNotifications';
import { TransactionContextMenuProvider } from './contexts/TransactionContextMenu.context';
import { useApplicationShortcuts } from './hooks/shortcuts/useApplicationShortcuts';

function App() {

	/**
	 * Fix viewheight for mobile from root
	 */
	useVhFix()

	/**
	 * Notify on certain history events
	 */
	useHistoryNotifications()

	/**
	 * Apply shortcuts
	 */
	useApplicationShortcuts()

	/**
	 * Initialize by fetching the user's profile if any
	 */
	const getProfile = useStoreActions(_ => _.auth.getProfile)
	useEffect(() => { getProfile() }, [getProfile])

	return <>
		<TransactionContextMenuProvider>
			<Notification />
			<Routes />
		</TransactionContextMenuProvider>
	</>
}

export default App;
