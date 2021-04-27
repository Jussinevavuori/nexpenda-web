import React, { useMemo } from "react";
import { ThemeProvider, ThemeProviderProps } from "@material-ui/styles";
import { useThemeColor } from "../../hooks/application/useThemeColor";
import { createTheme } from "../../styles/theme";
import { useThemeMode } from "../../hooks/application/useThemeMode";

export type MaterialUiThemeProviderProps = Omit<ThemeProviderProps, "theme">

export function MaterialUiThemeProvider(props: MaterialUiThemeProviderProps) {
	const [themeColor] = useThemeColor()
	const [themeMode] = useThemeMode()

	const theme = useMemo(() => {
		return createTheme(themeColor, themeMode)
	}, [themeColor, themeMode])

	return <ThemeProvider
		{...props}
		theme={theme}
	/>
}