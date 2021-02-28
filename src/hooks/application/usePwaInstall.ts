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
          ReactGA.event({
            action: "Install PWA",
            category: "PWA",
          });
        }
        return choiceResult;
      }
    : null;
}

// Catch the install event and prevent initial prompt
window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  ReactGA.event({
    action: "Display PWA Installer",
    category: "PWA",
    nonInteraction: true,
  });
  deferredPromptEvent = e;
});
