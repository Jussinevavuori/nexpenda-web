/**
 * All possible themes
 */
type ThemeColor = "blue" | "green" | "red" | "yellow" | "purple" | "pink";

/**
 * All possible color modes
 */
type ThemeMode = "dark" | "light";

type ThemePropertyLabel =
  | "color-100"
  | "color-200"
  | "color-300"
  | "color-400"
  | "color-500"
  | "color-600"
  | "color-700"
  | "color-800"
  | "color-900";

/**
 * Generic theme property that is manipulated via the theme feature
 */
type ThemeProperty = {
  type: "color";
  label: ThemePropertyLabel;
  sourceName: string;
  targetName: string;
};

/**
 * All text variants
 */
type TextVariant = "regular" | "bold" | "boldcaps" | "extrabold";

/**
 * All text sizes
 */
type TextSize = "sm" | "md" | "lg" | "xl" | "xxl" | "xxxl";

/**
 * All possible colors
 */
type Color =
  | "transparent"
  | "white"
  | "black"
  | "blue-100"
  | "blue-200"
  | "blue-300"
  | "blue-400"
  | "blue-500"
  | "blue-600"
  | "blue-700"
  | "blue-800"
  | "blue-900"
  | "gray-100"
  | "gray-200"
  | "gray-300"
  | "gray-400"
  | "gray-500"
  | "gray-600"
  | "gray-700"
  | "gray-800"
  | "gray-900"
  | "red-100"
  | "red-200"
  | "red-300"
  | "red-400"
  | "red-500"
  | "red-600"
  | "red-700"
  | "red-800"
  | "red-900"
  | "green-100"
  | "green-200"
  | "green-300"
  | "green-400"
  | "green-500"
  | "green-600"
  | "green-700"
  | "green-800"
  | "green-900"
  | "yellow-100"
  | "yellow-200"
  | "yellow-300"
  | "yellow-400"
  | "yellow-500"
  | "yellow-600"
  | "yellow-700"
  | "yellow-800"
  | "yellow-900"
  | "pink-100"
  | "pink-200"
  | "pink-300"
  | "pink-400"
  | "pink-500"
  | "pink-600"
  | "pink-700"
  | "pink-800"
  | "pink-900"
  | "purple-100"
  | "purple-200"
  | "purple-300"
  | "purple-400"
  | "purple-500"
  | "purple-600"
  | "purple-700"
  | "purple-800"
  | "purple-900"
  | "primary-100"
  | "primary-200"
  | "primary-300"
  | "primary-400"
  | "primary-500"
  | "primary-600"
  | "primary-700"
  | "primary-800"
  | "primary-900";
