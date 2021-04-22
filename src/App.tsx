import { Routes } from './Routes';
import { Notification } from "./components/Notification/Notification"
import { TransactionContextMenuProvider } from './contexts/TransactionContextMenu.context';
import { PremiumUserLockedOutDialog } from './components/PremiumUserLockedOutDialog/PremiumUserLockedOutDialog';
import { HooksRoot } from './components/HooksRoot/HooksRoot';

function App() {

	return <>
		<HooksRoot />
		<TransactionContextMenuProvider>
			<PremiumUserLockedOutDialog />
			<Notification />
			<Routes />
		</TransactionContextMenuProvider>
	</>
}

export default App;
