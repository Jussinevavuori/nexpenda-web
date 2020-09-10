import "./ChangePassword.scss";
import React, { useState } from "react"
import { AuthFrame } from "../../components/AuthFrame/AuthFrame";
import { ChangePasswordFormType, changePasswordValidationSchema } from "./ChangePasswordController";
import { Type } from "../../components/Type/Type";
import { yupResolver } from "@hookform/resolvers";
import { useForm } from "react-hook-form";
import { TextField, InputAdornment, IconButton, Button, CircularProgress } from "@material-ui/core";
import {
	Visibility as PasswordVisibleIcon,
	VisibilityOff as PasswordInvisibleIcon,
} from "@material-ui/icons";

export type ChangePasswordViewProps = {

	validTokenEmail: string | undefined | null;

	loading: boolean;

	passwordChangeSuccessful: boolean;

	error?: string;

	onSubmit(values: ChangePasswordFormType): void;

	onLogin(): void;

}

export function ChangePasswordView(props: ChangePasswordViewProps) {

	/**
	 * Password visible state
	 */
	const [passwordVisible, setPasswordVisible] = useState(false)

	/**
	 * React hook form
	 */
	const form = useForm<ChangePasswordFormType>({
		resolver: yupResolver(changePasswordValidationSchema),
	})

	/**
	 * Email and password error shorthands for react hook form
	 */
	const passwordError = form.formState.touched.password && form.errors.password?.message

	return <div className="ChangePassword">

		<AuthFrame

			header="Change password"

			body={(() => {

				if (props.loading) {

					return <CircularProgress />

				} else if (!props.validTokenEmail) {

					return <>

						<Type color="error">
							{"Invalid password change link"}
						</Type>

						<Button
							variant="contained"
							color="primary"
							onClick={props.onLogin}
							fullWidth
						>
							{"Back to login"}
						</Button>

					</>

				} else if (props.passwordChangeSuccessful) {

					return <>

						<Type>
							{"Password changed for " + props.validTokenEmail}
						</Type>

						<Button
							variant="contained"
							color="primary"
							onClick={props.onLogin}
							fullWidth
						>
							{"Login"}
						</Button>

					</>

				} else {

					return <form onSubmit={form.handleSubmit(props.onSubmit)}>

						<Type>
							{"Enter a new password for " + props.validTokenEmail}
						</Type>

						<TextField
							id="change-password"
							name="password"
							type={passwordVisible ? "text" : "password"}
							inputRef={form.register}
							label="Password"
							variant="outlined"
							error={!!passwordError}
							helperText={passwordError}
							fullWidth
							InputProps={{
								endAdornment: <InputAdornment position="end">
									<IconButton onClick={() => setPasswordVisible(_ => !_)} size="small">
										{passwordVisible ? <PasswordVisibleIcon /> : <PasswordInvisibleIcon />}
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
							props.error ?
								<Type color="error">
									{props.error}
								</Type>
								: null
						}

					</form>

				}

			})()}

		/>

	</div>
}