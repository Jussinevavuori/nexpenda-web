import React, { useEffect } from 'react';
import { useVhFix } from './hooks/utils/useVhFix';
import { Routes } from './Routes';
import { useStoreActions } from './store';
import { Notification } from "./components/Notification/Notification"
import { useHistoryNotifications } from './hooks/application/useHistoryNotifications';
import { TransactionContextMenuProvider } from './contexts/TransactionContextMenu.context';
import { useApplicationShortcuts } from './hooks/shortcuts/useApplicationShortcuts';
import { useGtagTracking } from './hooks/gtag/useGtagTracking';
import { PremiumUserLockedOutDialog } from './components/PremiumUserLockedOutDialog/PremiumUserLockedOutDialog';

function App() {
	useGtagTracking()
	useVhFix()
	useHistoryNotifications()
	useApplicationShortcuts()

	/**
	 * Initialize by fetching the user's profile if any
	 */
	const getProfile = useStoreActions(_ => _.auth.getProfile)
	useEffect(() => { getProfile() }, [getProfile])

	return <>
		<TransactionContextMenuProvider>
			<PremiumUserLockedOutDialog />
			<Notification />
			<Routes />
		</TransactionContextMenuProvider>
	</>
}

export default App;
