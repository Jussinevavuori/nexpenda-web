import { createMuiTheme } from "@material-ui/core";

// Access any CSS var in :root by name
function cssvar(name: string) {
  return getComputedStyle(document.documentElement).getPropertyValue(
    "--" + name
  );
}

export const theme = createMuiTheme({
  palette: {
    primary: {
      main: cssvar("color-primary-main").substring(1),
      dark: cssvar("color-primary-dark").substring(1),
      light: cssvar("color-primary-light").substring(1),
      50: cssvar("color-primary-50").substring(1),
      100: cssvar("color-primary-100").substring(1),
      200: cssvar("color-primary-200").substring(1),
      300: cssvar("color-primary-300").substring(1),
      400: cssvar("color-primary-400").substring(1),
      500: cssvar("color-primary-500").substring(1),
      600: cssvar("color-primary-600").substring(1),
      700: cssvar("color-primary-900").substring(1),
      800: cssvar("color-primary-700").substring(1),
      900: cssvar("color-primary-700").substring(1),
    },
  },
});
