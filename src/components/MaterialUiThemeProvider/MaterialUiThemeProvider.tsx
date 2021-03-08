import React, { useMemo } from "react";
import { ThemeProvider, ThemeProviderProps } from "@material-ui/styles";
import { useTheme } from "../../hooks/application/useTheme";
import { createTheme } from "../../styles/theme";

export type MaterialUiThemeProviderProps = Omit<ThemeProviderProps, "theme">

export function MaterialUiThemeProvider(props: MaterialUiThemeProviderProps) {
	const [themeVariant] = useTheme()
	const theme = useMemo(() => createTheme(themeVariant), [themeVariant])

	return <ThemeProvider
		{...props}
		theme={theme}
	/>
}