import "./ForgotPassword.scss";
import React from "react"
import { ForgotPasswordFormType, forgotPasswordValidationSchema } from "./ForgotPasswordController";
import { Text } from "../../components/Text/Text";
import { TextField, Button, Divider, InputAdornment } from "@material-ui/core";
import { Email as EmailIcon } from "@material-ui/icons";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers";

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

	return <div className="ForgotPassword AuthView">

		<div className="container">

			<header>

				<Text.Header.H5 weight="bold" padding="sm" color="white">
					{"Forgot password"}
				</Text.Header.H5>

			</header>

			<div className="content">

				{

					props.success
						? <Text.Paragraph>
							{"Recovery email sent. Check your email."}
						</Text.Paragraph>
						: <form noValidate onSubmit={handleSubmit(props.handleSubmit)}>

							<Text.Paragraph>
								{"Enter your email below and we will send you an email containing a link, which you can use to change your password."}
							</Text.Paragraph>

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
									? <Text.Paragraph error>
										{props.error}
									</Text.Paragraph>
									: null
							}

						</form >

				}



				<Divider />

				<div className="signInOptions">

					<Button onClick={() => props.handleLogin()}>
						{"Back"}
					</Button>

				</div>

			</div>

		</div>

	</div>
}