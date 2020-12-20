import "./ForgotPassword.scss";
import React from "react"
import { ForgotPasswordFormType, forgotPasswordValidationSchema } from "./ForgotPasswordController";
import { TextField, Button, InputAdornment } from "@material-ui/core";
import { Email as EmailIcon } from "@material-ui/icons";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers";
import { AuthFrame } from "../../components/AuthFrame/AuthFrame";
import { Type } from "../../components/Type/Type";

export type ForgotPasswordViewProps = {
	handleSubmit(values: ForgotPasswordFormType): Promise<void>;
	handleGoogleSubmit(): Promise<void>;
	handleLogin(): Promise<void>;
	handleCreateAccount(): Promise<void>;
	success: boolean;
	error?: string;
}

export function ForgotPasswordView(props: ForgotPasswordViewProps) {

	/**
	 * React hook form
	 */
	const { register, handleSubmit, errors, formState, ...form } = useForm<ForgotPasswordFormType>({
		resolver: yupResolver(forgotPasswordValidationSchema),
	})

	/**
	 * Email and password error shorthands for react hook form
	 */
	const emailError = formState.touched.email && errors.email?.message

	return <div className="ForgotPassword">

		<AuthFrame

			header="Forgot password"

			body={
				props.success
					? <Type>
						{"Recovery email sent. Check your email."}
					</Type>
					: <form noValidate onSubmit={handleSubmit(props.handleSubmit)}>

						<Type>
							{"Enter your email below and we will send you an email containing a link, which you can use to change your password."}
						</Type>

						<TextField
							id="login-email"
							name="email"
							type="text"
							inputRef={register}
							label="Email"
							variant="outlined"
							error={!!emailError}
							helperText={emailError}
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
							props.error
								? <Type color="red-600">
									{props.error}
								</Type>
								: null
						}

					</form >

			}

			footer={
				<Button onClick={() => props.handleLogin()}>
					{"Back"}
				</Button>}

		/>

	</div >
}