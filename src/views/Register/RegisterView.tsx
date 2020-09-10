import "./Register.scss"
import React, { useState } from 'react';
import { useForm } from "react-hook-form"
import { registerValidationSchema, RegisterFormType } from './RegisterController';
import { yupResolver } from '@hookform/resolvers';
import { TextField, Button, InputAdornment, IconButton } from "@material-ui/core";
import {
	Email as EmailIcon,
	Visibility as PasswordVisibleIcon,
	VisibilityOff as PasswordInvisibleIcon,
} from "@material-ui/icons";
import { AuthFrame } from "../../components/AuthFrame/AuthFrame";
import { Type } from "../../components/Type/Type";


export type RegisterViewProps = {
	handleSubmit(values: RegisterFormType): Promise<void>;
	handleLogin(): Promise<void>;
	error?: string;
	registered: boolean;
}

export const RegisterView: React.FC<RegisterViewProps> = (props) => {

	const [passwordVisible, setPasswordVisible] = useState(false)

	const form = useForm<RegisterFormType>({
		resolver: yupResolver(registerValidationSchema),
	})

	const emailError = form.formState.touched.email && form.errors.email?.message
	const passwordError = form.formState.touched.password && form.errors.password?.message

	return <div className="Register">

		<AuthFrame

			header="Create account"

			body={
				props.registered
					? <>
						<Type variant="h6">
							{"Succesfully registered."}
						</Type>
						<Type>
							{"Check your email in order to confirm your email address. "}
							{"You can login after having confirmation."}
						</Type>
					</>
					: <form onSubmit={form.handleSubmit(props.handleSubmit)}>

						<TextField
							id="register-email"
							name="email"
							type="text"
							inputRef={form.register}
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

						<TextField
							id="register-password"
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
							{"Create account"}
						</Button>

						{
							props.error
								? <Type color="error">
									{props.error}
								</Type>
								: null
						}

					</form >
			}

			footer={
				<Button onClick={() => props.handleLogin()}>
					{"Already have an account? Login"}
				</Button>
			}

		/>

	</div>
}