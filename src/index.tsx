import "./styles/index.scss"
import "./styles/main.scss"
import "./styles/vars.css"
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import ReactGA from "react-ga";
import * as serviceWorker from './serviceWorkerRegistration';
import { store } from './store';
import { StoreProvider } from 'easy-peasy';
import { BrowserRouter } from 'react-router-dom';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import { LocalizedUtils } from "./utils/LocaleUtils/CustomLocale";
import { MaterialUiThemeProvider } from "./components/MaterialUiThemeProvider/MaterialUiThemeProvider";

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


document.head.prepend((() => {
	const el = document.createElement("script")
	el.innerHTML = `
		window.dataLayer = window.dataLayer || [];
		function gtag() {
			dataLayer.push(arguments);
		}
		gtag("js", new Date());
		gtag("config", "G-LVM2P76WDY");
	`
	return el
})())

// Initialize Google Analytics
export const GOOGLE_ANALYTICS_TRACKING_ID = "G-LVM2P76WDY";
ReactGA.initialize(GOOGLE_ANALYTICS_TRACKING_ID);

serviceWorker.register();
