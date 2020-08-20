import createMuiTheme from "@material-ui/core/styles/createMuiTheme";

export const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#5E24FF",
      light: "#767EE5",
      dark: "#300D94",
      contrastText: "#ffffff",
      A100: "#5E24FF",
      A200: "#5E24FF",
      A400: "#5E24FF",
      A700: "#5E24FF",
      "50": "#F7F3FF",
      "100": "#AEB2EF",
      "200": "#979DE8",
      "300": "#767EE5",
      "400": "#6A4EF6",
      "500": "#5E24FF",
      "600": "#420CD8",
      "700": "#390CB5",
      "800": "#300D94",
      "900": "#200D55",
    },
  },
});

/**
 * Expose theme to window in development
 */
if (process.env.NODE_ENV === "development") {
  (window as any).theme = theme;
}
