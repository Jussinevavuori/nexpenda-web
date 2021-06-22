import ReactGA from "react-ga";

export class GoogleAnalytics {
  static TrackingID = "G-LVM2P76WDY";

  static initialize() {
    document.head.prepend(
      (() => {
        const el = document.createElement("script");
        el.innerHTML = `
				window.dataLayer = window.dataLayer || [];
				function gtag() {
					dataLayer.push(arguments);
				}
				gtag("js", new Date());
				gtag("config", "G-LVM2P76WDY");
			`;
        return el;
      })()
    );

    ReactGA.initialize(GoogleAnalytics.TrackingID);
  }
}
