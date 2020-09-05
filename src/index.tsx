import "./styles/index.scss"
import "./styles/main.scss"
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { store } from './store';
import { StoreProvider } from 'easy-peasy';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from "@material-ui/core";
import { theme } from "./styles/theme";

ReactDOM.render(
	<StoreProvider store={store}>
		<ThemeProvider theme={theme}>
			<React.StrictMode>
				<BrowserRouter>
					<App />
				</BrowserRouter>
			</React.StrictMode>
		</ThemeProvider>
	</StoreProvider>,
	document.getElementById('root')
);

serviceWorker.unregister();
