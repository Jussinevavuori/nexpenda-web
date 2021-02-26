import ReactGA from "react-ga";
let deferredPromptEvent: any;

/**
 * Provides a function to trigger the PWA installation. If the installation
 * is unavailable, returns null
 */
export function usePwaInstall() {
  return Boolean(deferredPromptEvent)
    ? async () => {
        deferredPromptEvent.prompt();
        const choiceResult = await deferredPromptEvent.userChoice;
        if (choiceResult) {
          ReactGA.event({ action: "install_pwa", category: "pwa" });
        }
        return choiceResult;
      }
    : null;
}

// Catch the install event and prevent initial prompt
window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  ReactGA.event({
    action: "display_installer",
    category: "pwa",
    nonInteraction: true,
  });
  deferredPromptEvent = e;
});
