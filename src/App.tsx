import { useVhFix } from './hooks/utils/useVhFix';
import { Routes } from './Routes';
import { Notification } from "./components/Notification/Notification"
import { useHistoryNotifications } from './hooks/application/useHistoryNotifications';
import { TransactionContextMenuProvider } from './contexts/TransactionContextMenu.context';
import { useApplicationShortcuts } from './hooks/shortcuts/useApplicationShortcuts';
import { useGtagTracking } from './hooks/gtag/useGtagTracking';
import { PremiumUserLockedOutDialog } from './components/PremiumUserLockedOutDialog/PremiumUserLockedOutDialog';
import { useInitializeData } from './hooks/application/useInitializeData';

function App() {
	useGtagTracking()
	useVhFix()
	useHistoryNotifications()
	useApplicationShortcuts()
	useInitializeData()

	return <>
		<TransactionContextMenuProvider>
			<PremiumUserLockedOutDialog />
			<Notification />
			<Routes />
		</TransactionContextMenuProvider>
	</>
}

export default App;
