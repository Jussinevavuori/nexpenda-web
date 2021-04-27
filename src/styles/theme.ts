import { unstable_createMuiStrictModeTheme as createMuiTheme } from "@material-ui/core";
import { theme as _ } from "./main";

/**
 * Create a Material UI theme based on the currently selected theme.
 *
 * @param color Theme color variant to use
 * @param mode  Theme mode variant to use
 * @returns Created Material UI theme
 */
export function createTheme(color: ThemeColor, mode: ThemeMode) {
  /**
   * Define all font styles
   */
  const fonts = {
    regular: {
      fontWeight: Number(_.text_regular),
      textTransform: "none",
      letterSpacing: _.text_regular_spacing,
    },
    bold: {
      fontWeight: Number(_.text_bold),
      textTransform: "none",
      letterSpacing: _.text_bold_spacing,
    },
    boldcaps: {
      fontWeight: Number(_.text_bold),
      textTransform: "uppercase",
      letterSpacing: _.text_boldcaps_spacing,
    },
  } as const;

  /**
   * Define all color palettes
   */
  const colors = {
    blue: {
      main: _.blue_500,
      dark: _.blue_700,
      light: _.blue_300,
      50: _.blue_100,
      100: _.blue_100,
      200: _.blue_200,
      300: _.blue_300,
      400: _.blue_400,
      500: _.blue_500,
      600: _.blue_600,
      700: _.blue_700,
      800: _.blue_800,
      900: _.blue_900,
      A100: _.blue_100,
      A200: _.blue_200,
      A400: _.blue_400,
      A700: _.blue_700,
      contrastText: _.white,
    },
    green: {
      main: _.green_500,
      dark: _.green_700,
      light: _.green_300,
      50: _.green_100,
      100: _.green_100,
      200: _.green_200,
      300: _.green_300,
      400: _.green_400,
      500: _.green_500,
      600: _.green_600,
      700: _.green_700,
      800: _.green_800,
      900: _.green_900,
      A100: _.green_100,
      A200: _.green_200,
      A400: _.green_400,
      A700: _.green_700,
      contrastText: _.white,
    },
    red: {
      main: _.red_500,
      dark: _.red_700,
      light: _.red_300,
      50: _.red_100,
      100: _.red_100,
      200: _.red_200,
      300: _.red_300,
      400: _.red_400,
      500: _.red_500,
      600: _.red_600,
      700: _.red_700,
      800: _.red_800,
      900: _.red_900,
      A100: _.red_100,
      A200: _.red_200,
      A400: _.red_400,
      A700: _.red_700,
      contrastText: _.white,
    },
    yellow: {
      main: _.yellow_500,
      dark: _.yellow_700,
      light: _.yellow_300,
      50: _.yellow_100,
      100: _.yellow_100,
      200: _.yellow_200,
      300: _.yellow_300,
      400: _.yellow_400,
      500: _.yellow_500,
      600: _.yellow_600,
      700: _.yellow_700,
      800: _.yellow_800,
      900: _.yellow_900,
      A100: _.yellow_100,
      A200: _.yellow_200,
      A400: _.yellow_400,
      A700: _.yellow_700,
      contrastText: _.white,
    },
    pink: {
      main: _.pink_500,
      dark: _.pink_700,
      light: _.pink_300,
      50: _.pink_100,
      100: _.pink_100,
      200: _.pink_200,
      300: _.pink_300,
      400: _.pink_400,
      500: _.pink_500,
      600: _.pink_600,
      700: _.pink_700,
      800: _.pink_800,
      900: _.pink_900,
      A100: _.pink_100,
      A200: _.pink_200,
      A400: _.pink_400,
      A700: _.pink_700,
      contrastText: _.white,
    },
    purple: {
      main: _.purple_500,
      dark: _.purple_700,
      light: _.purple_300,
      50: _.purple_100,
      100: _.purple_100,
      200: _.purple_200,
      300: _.purple_300,
      400: _.purple_400,
      500: _.purple_500,
      600: _.purple_600,
      700: _.purple_700,
      800: _.purple_800,
      900: _.purple_900,
      A100: _.purple_100,
      A200: _.purple_200,
      A400: _.purple_400,
      A700: _.purple_700,
      contrastText: _.white,
    },
    gray: {
      50: _.gray_100,
      100: _.gray_100,
      200: _.gray_200,
      300: _.gray_300,
      400: _.gray_400,
      500: _.gray_500,
      600: _.gray_600,
      700: _.gray_700,
      800: _.gray_800,
      900: _.gray_900,
      A100: _.gray_100,
      A200: _.gray_200,
      A400: _.gray_400,
      A700: _.gray_700,
    },
  };

  /**
   * Create the Mui Theme
   */
  return createMuiTheme({
    /**
     * Apply typography
     */
    typography: {
      fontFamily: _.poppins,
      h1: { fontSize: _.text_xxxl, ...fonts.bold },
      h2: { fontSize: _.text_xxl, ...fonts.bold },
      h3: { fontSize: _.text_xl, ...fonts.bold },
      h4: { fontSize: _.text_lg, ...fonts.bold },
      h5: { fontSize: _.text_md, ...fonts.bold },
      h6: { fontSize: _.text_sm, ...fonts.bold },
      body1: { fontSize: _.text_md, ...fonts.regular },
      body2: { fontSize: _.text_sm, ...fonts.boldcaps },
      button: { fontSize: _.text_md, ...fonts.bold },
      fontWeightBold: Number(_.text_bold),
      fontWeightLight: Number(_.text_light),
      fontWeightMedium: Number(_.text_regular),
      fontWeightRegular: Number(_.text_regular),
    },
    /**
     * Apply colors by current theme
     */
    palette: {
      primary: colors[color],
      success: colors.green,
      error: colors.red,
      info: colors[color],
      secondary: colors[color],
      grey: colors.gray,
      divider: _.gray_300,
      common: { black: _.black, white: _.white },
      background: { default: _.white, paper: _.white },
    },
    /**
     * Overrides
     */
    overrides: {
      MuiTooltip: {
        tooltip: {
          backgroundColor: "#ffffff",
          border: `1px solid ${colors[color][500]}`,
          color: `${colors["gray"][800]}`,
          fontSize: _.text_sm,
        },
      },
    },
  });
}
