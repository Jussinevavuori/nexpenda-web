import "./ResetPassword.scss";
import React from "react"
import { useResetPasswordController } from "./useResetPasswordController";
import { TextField, Button, InputAdornment } from "@material-ui/core";
import { Email as EmailIcon } from "@material-ui/icons";
import { Type } from "../../components/Type/Type";
import { useIsDarkTheme } from "../../hooks/application/useIsThemeMode";

export function ResetPassword() {

	const controller = useResetPasswordController()
	const isDarkTheme = useIsDarkTheme()

	return <div className="ResetPassword">

		<Type
			component="h1"
			variant="bold"
			color={isDarkTheme ? "gray-100" : "gray-900"}
			size="xxl"
		>
			{"Reset password"}
		</Type>

		<main>
			{
				controller.success
					? <Type>
						{"Recovery email sent. Check your email."}
					</Type>
					: <form noValidate onSubmit={controller.handleSubmit}>

						<Type color={isDarkTheme ? "gray-500" : "gray-300"}>
							{"Enter your email below and we will send you an email containing a link, which you can use to change your password."}
						</Type>

						<TextField
							id="login-email"
							name="email"
							type="text"
							inputRef={controller.form.register}
							label="Email"
							variant="outlined"
							error={!!controller.emailError}
							helperText={controller.emailError}
							fullWidth
							InputProps={{
								endAdornment: <InputAdornment position="end">
									<EmailIcon />
								</InputAdornment>
							}}
						/>

						<Button
							variant="contained"
							color="primary"
							type="submit"
							fullWidth
						>
							{"Send recovery email"}
						</Button>

						{
							controller.error
								? <Type color="red-600">
									{controller.error}
								</Type>
								: null
						}

					</form >
			}
		</main>

		<footer>
			<Button onClick={() => controller.handleLogin()}>
				{"Back"}
			</Button>
		</footer>

	</div >
}