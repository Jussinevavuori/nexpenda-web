import "./ForgotPassword.scss";
import React from "react"
import { useForgotPasswordController } from "./useForgotPasswordController";
import { TextField, Button, InputAdornment } from "@material-ui/core";
import { Email as EmailIcon } from "@material-ui/icons";
import { Type } from "../../components/Type/Type";

export function ForgotPassword() {

	const controller = useForgotPasswordController()

	return <div className="ForgotPassword">

		<Type
			component="h1"
			variant="bold"
			color="black"
			size="xxl"
		>
			{"Forgot password"}
		</Type>

		<main>
			{
				controller.success
					? <Type>
						{"Recovery email sent. Check your email."}
					</Type>
					: <form noValidate onSubmit={controller.handleSubmit}>

						<Type>
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