import React, { useEffect } from 'react';
import { Routes } from './Routes';
import { useStoreActions } from './store';

function App() {

	/**
	 * Initialize by fetching the user's profile if any
	 */
	const getProfile = useStoreActions(_ => _.authentication.getProfile)

	useEffect(() => {
		getProfile()
	}, [getProfile])

	return <Routes />
}

export default App;
