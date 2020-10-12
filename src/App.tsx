import React, { useEffect } from 'react';
import { useVhFix } from './hooks/useVhFix';
import { Routes } from './Routes';
import { useStoreActions } from './store';
import { Notification } from "./components/Notification/NotificationController"
import { useHistoryNotifications } from './hooks/useHistoryNotifications';

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
	 * Initialize by fetching the user's profile if any
	 */
	const getProfile = useStoreActions(_ => _.auth.getProfile)
	// useEffect(() => { getProfile() }, [getProfile])
	useEffect(() => { setTimeout(getProfile, 5000) }, [getProfile])

	return <>
		<Notification />
		<Routes />
	</>
}

export default App;
