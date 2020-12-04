import { unstable_createMuiStrictModeTheme as createMuiTheme } from "@material-ui/core";

import { theme as _ } from "./main";

const regular = {
  fontWeight: Number(_.text_regular),
  textTransform: "none",
  letterSpacing: _.text_regular_spacing,
} as const;

const bold = {
  fontWeight: Number(_.text_bold),
  textTransform: "none",
  letterSpacing: _.text_bold_spacing,
} as const;

const boldcaps = {
  fontWeight: Number(_.text_bold),
  textTransform: "uppercase",
  letterSpacing: _.text_boldcaps_spacing,
} as const;

export const theme = createMuiTheme({
  typography: {
    fontFamily: _.poppins,
    h1: { fontSize: _.text_xxxl, ...bold },
    h2: { fontSize: _.text_xxl, ...bold },
    h3: { fontSize: _.text_xl, ...bold },
    h4: { fontSize: _.text_lg, ...bold },
    h5: { fontSize: _.text_md, ...bold },
    h6: { fontSize: _.text_sm, ...bold },
    body1: { fontSize: _.text_md, ...regular },
    body2: { fontSize: _.text_sm, ...boldcaps },
    button: { fontSize: _.text_md, ...bold },
    fontWeightBold: Number(_.text_bold),
    fontWeightLight: Number(_.text_light),
    fontWeightMedium: Number(_.text_regular),
    fontWeightRegular: Number(_.text_regular),
  },
  palette: {
    primary: {
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
    success: {
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
    error: {
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
    info: {
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
    secondary: {
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
    grey: {
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
    divider: _.gray_300,
    common: {
      black: _.black,
      white: _.white,
    },
    background: {
      default: _.white,
      paper: _.white,
    },
  },
});

if (process.env.NODE_ENV === "development") {
  (window as any).theme = theme;
}
