import React, { useMemo } from "react";
import { ThemeProvider, ThemeProviderProps } from "@material-ui/styles";
import { useTheme } from "../../hooks/application/useTheme";
import { createTheme } from "../../styles/theme";

export type MaterialUiThemeProviderProps = Omit<ThemeProviderProps, "theme">

export function MaterialUiThemeProvider(props: MaterialUiThemeProviderProps) {
	const [variant, setVariant] = useTheme()
	const theme = useMemo(() => createTheme(variant), [variant])

	React.useEffect(() => {
		(window as any).toggleTheme = () => {
			const target = variant === "blue" ? "green" : "blue"
			setVariant(target)
		}
	}, [variant, setVariant])

	return <ThemeProvider
		{...props}
		theme={theme}
	/>
}