import React, { useEffect } from 'react';
import { useVhFix } from './hooks/useVhFix';
import { Routes } from './Routes';
import { useStoreActions } from './store';

function App() {

	/**
	 * Fix viewheight for mobile from root
	 */
	useVhFix()

	/**
	 * Initialize by fetching the user's profile if any
	 */
	const getProfile = useStoreActions(_ => _.auth.getProfile)
	useEffect(() => {
		getProfile()
	}, [getProfile])

	return <Routes />
}

export default App;
