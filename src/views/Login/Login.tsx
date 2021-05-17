import "./Login.scss";
import React from 'react';
import { TextField, Button, InputAdornment, IconButton } from "@material-ui/core";
import googleLogo from "../../assets/logos/googleLogo.png"
import {
	Email as EmailIcon,
	Visibility as PasswordVisibleIcon,
	VisibilityOff as PasswordInvisibleIcon,
} from "@material-ui/icons";
import { Type } from "../../components/Type/Type";
import { useLoginController } from "./useLoginController";
import { motion, AnimateSharedLayout } from "framer-motion";
import { AutoLoginIndicator } from "../../components/AutoLoginIndicator/AutoLoginIndicator";
import { useIsDarkTheme } from "../../hooks/application/useIsThemeMode";

export type LoginProps = {
}

export function Login() {
	const controller = useLoginController()
	const isDarkTheme = useIsDarkTheme()

	return <AnimateSharedLayout>
		<div className="Login">

			<Type
				component="h1"
				variant="bold"
				color={isDarkTheme ? "gray-100" : "gray-900"}
				size="xxl"
			>
				{"Log in"}
			</Type>

			<AutoLoginIndicator />

			<motion.main layout="position">
				<form noValidate onSubmit={controller.handleSubmit}>

					<div className="oauthProviders">
						<Button
							variant="outlined"
							onClick={controller.handleGoogleSubmit}
							fullWidth
						>
							<div className="oauthproviderLogo">
								<img src={googleLogo} alt="Google Logo" />
							</div>
							{"Log in with Google"}
						</Button>
					</div>

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

					<TextField
						id="login-password"
						name="password"
						type={controller.passwordVisible ? "text" : "password"}
						inputRef={controller.form.register}
						label="Password"
						variant="outlined"
						error={!!controller.passwordError}
						helperText={controller.passwordError}
						fullWidth
						InputProps={{
							endAdornment: <InputAdornment position="end">
								<IconButton
									onClick={controller.togglePasswordVisibility}
									size="small"
								>
									{
										controller.passwordVisible
											? <PasswordVisibleIcon />
											: <PasswordInvisibleIcon />
									}
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
						{"Log in"}
					</Button>

					{
						controller.error
							? <Type color="red-600">
								{controller.error}
							</Type>
							: null
					}

				</form>
			</motion.main>

			<footer>
				<Button onClick={controller.handleCreateAccount}>
					{"Create account"}
				</Button>

				<Button onClick={controller.handleForgotPassword}>
					{"Forgot password"}
				</Button>
			</footer>

		</div>
	</AnimateSharedLayout>
}