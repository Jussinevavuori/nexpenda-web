import "./styles/reset.css"
import "./styles/variables.css"
import "./styles/index.css"
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { StoreProvider } from 'easy-peasy';
import { store } from './store';
import { BrowserRouter } from 'react-router-dom';

ReactDOM.render(
	<StoreProvider store={store}>
		<React.StrictMode>
			<BrowserRouter>
				<App />
			</BrowserRouter>
		</React.StrictMode>
	</StoreProvider>,
	document.getElementById('root')
);

serviceWorker.unregister();
