import { Routes } from './Routes';
import { Notification } from "./components/Notification/Notification"
import { TransactionContextMenuProvider } from './contexts/TransactionContextMenu.context';
import { PremiumUserLockedOutDialog } from './components/PremiumUserLockedOutDialog/PremiumUserLockedOutDialog';
import { HooksRoot } from './components/HooksRoot/HooksRoot';
import { ElementContextProvider } from './contexts/ElementContext.context';

function App() {

	return <>
		<HooksRoot />
		<ElementContextProvider>
			<TransactionContextMenuProvider>
				<PremiumUserLockedOutDialog />
				<Notification />
				<Routes />
			</TransactionContextMenuProvider>
		</ElementContextProvider>
	</>
}

export default App;
