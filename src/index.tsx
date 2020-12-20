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
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import { theme } from "./styles/theme";
import DateFnsUtils from "@date-io/date-fns"

ReactDOM.render(
	<React.StrictMode>
		<StoreProvider store={store}>
			<ThemeProvider theme={theme}>
				<MuiPickersUtilsProvider utils={DateFnsUtils}>
					<BrowserRouter>
						<App />
					</BrowserRouter>
				</MuiPickersUtilsProvider>
			</ThemeProvider>
		</StoreProvider>
	</React.StrictMode>,
	document.getElementById('root')
);

serviceWorker.register();
