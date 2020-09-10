import "./ConfirmEmail.scss";
import React from "react"
import { AuthFrame } from "../../components/AuthFrame/AuthFrame";
import { Type } from "../../components/Type/Type";
import { Button, CircularProgress } from "@material-ui/core";

export type ConfirmEmailViewProps = {
	success: undefined | boolean;
	onLogin(): void;
}

export function ConfirmEmailView(props: ConfirmEmailViewProps) {

	return <div className="ConfirmEmail">

		<AuthFrame

			header="Change password"

			body={(() => {

				switch (props.success) {

					case undefined:

						return <CircularProgress />

					case false:

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

					case true:

						return <>

							<Type>
								{"Email succesfully confirmed"}
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

				}

			})()}

		/>

	</div>
}