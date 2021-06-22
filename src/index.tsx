import "./styles/index.scss"
import "./styles/main.scss"
import "./styles/vars.css"
import * as serviceWorker from './serviceWorkerRegistration';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { store } from './store';
import { StoreProvider } from 'easy-peasy';
import { BrowserRouter } from 'react-router-dom';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import { LocalizedUtils } from "./lib/Locales/CustomLocale";
import { MaterialUiThemeProvider } from "./components/MaterialUiThemeProvider/MaterialUiThemeProvider";
import { ThemeUtils } from "./lib/Theme/ThemeUtils";
import { GoogleAnalytics } from "./lib/GoogleAnalytics/GoogleAnalytics";

// Initializations
ThemeUtils.initialize();
GoogleAnalytics.initialize()

// Render
ReactDOM.render(
	<React.StrictMode>
		<StoreProvider store={store}>
			<MaterialUiThemeProvider>
				<MuiPickersUtilsProvider
					utils={LocalizedUtils}
					locale={LocalizedUtils.Locale}
				>
					<BrowserRouter>
						<App />
					</BrowserRouter>
				</MuiPickersUtilsProvider>
			</MaterialUiThemeProvider>
		</StoreProvider>
	</React.StrictMode>,
	document.getElementById('root')
);

// Service worker
serviceWorker.register();
