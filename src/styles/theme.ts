import {
  unstable_createMuiStrictModeTheme as createMuiTheme,
  colors,
} from "@material-ui/core";

// Access any CSS var in :root by name
function cssvar(
  name: string,
  options?: {
    color?: boolean;
  }
) {
  let value = getComputedStyle(document.documentElement).getPropertyValue(
    "--" + name
  );
  if (options) {
    if (options.color) {
      if (process.env.NODE_ENV === "development") {
        value = value.substring(1);
      }
    }
  }
  return value;
}

export const theme = createMuiTheme({
  palette: {
    primary: {
      ...colors.deepPurple,
      main: cssvar("color-primary-main", { color: true }),
      dark: cssvar("color-primary-dark", { color: true }),
      light: cssvar("color-primary-light", { color: true }),
      50: cssvar("color-primary-50", { color: true }),
      100: cssvar("color-primary-100", { color: true }),
      200: cssvar("color-primary-200", { color: true }),
      300: cssvar("color-primary-300", { color: true }),
      400: cssvar("color-primary-400", { color: true }),
      500: cssvar("color-primary-500", { color: true }),
      600: cssvar("color-primary-600", { color: true }),
      700: cssvar("color-primary-900", { color: true }),
      800: cssvar("color-primary-800", { color: true }),
      900: cssvar("color-primary-700", { color: true }),
      contrastText: "#fff",
    },
  },
});

if (process.env.NODE_ENV === "development") {
  (window as any).theme = theme;
}
