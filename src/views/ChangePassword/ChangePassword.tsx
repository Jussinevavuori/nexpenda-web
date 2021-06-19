import "./ChangePassword.scss";
import React from "react"
import { useChangePasswordController } from "./useChangePasswordController";
import { Type } from "../../components/Type/Type";
import { TextField, InputAdornment, IconButton, Button, CircularProgress } from "@material-ui/core";
import {
	Visibility as PasswordVisibleIcon,
	VisibilityOff as PasswordInvisibleIcon,
} from "@material-ui/icons";
import { useIsDarkTheme } from "../../hooks/application/useIsThemeMode";


export function ChangePassword() {

	const controller = useChangePasswordController()
	const isDarkTheme = useIsDarkTheme()

	return <div className="ChangePassword">

		<Type
			component="h1"
			variant="bold"
			color={isDarkTheme ? "gray-100" : "gray-900"}
			size="xxl"
		>
			{"Change your password"}
		</Type>

		<main>
			{(() => {

				if (controller.loading) {

					return <CircularProgress />

				} else if (!controller.validTokenEmail) {

					return <>

						<Type color={isDarkTheme ? "red-400" : "red-600"}>
							{controller.error ?? "Invalid password change link"}
						</Type>

						<footer>
							<Button
								variant="contained"
								color="primary"
								onClick={controller.handleLogin}
								fullWidth
							>
								{"Back to login"}
							</Button>
						</footer>

					</>

				} else if (controller.passwordChangeSuccessful) {

					return <>

						<Type
							color={isDarkTheme ? "green-400" : "green-600"}
							variant="bold"
						>
							{"Password changed for " + controller.validTokenEmail}
						</Type>

						<footer>
							<Button
								variant="contained"
								color="primary"
								onClick={controller.handleLogin}
								fullWidth
							>
								{"Login"}
							</Button>
						</footer>

					</>

				} else {

					return <form onSubmit={controller.handleSubmit}>

						<Type>
							{"Enter a new password for " + controller.validTokenEmail}
						</Type>

						<TextField
							{...controller.form.register("password")}
							id="change-password"
							type={controller.passwordVisible ? "text" : "password"}
							label="Password"
							variant="outlined"
							error={!!controller.passwordError}
							helperText={controller.passwordError}
							fullWidth
							InputProps={{
								endAdornment: <InputAdornment position="end">
									<IconButton onClick={controller.togglePasswordVisibility} size="small">
										{controller.passwordVisible ? <PasswordVisibleIcon /> : <PasswordInvisibleIcon />}
									</IconButton>
								</InputAdornment>,
							}}
						/>

						<Button
							variant="contained"
							color="primary"
							type="submit"
							fullWidth
						>
							{"Change password"}
						</Button>

						{
							controller.error ?
								<Type color="red-600">
									{controller.error}
								</Type>
								: null
						}

						<footer>
							<Button
								variant="text"
								onClick={controller.handleLogin}
							>
								{"Back to login"}
							</Button>
						</footer>

					</form>

				}

			})()}
		</main>
	</div>
}