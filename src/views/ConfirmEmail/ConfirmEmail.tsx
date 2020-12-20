import "./ConfirmEmail.scss";
import React from "react"
import { Type } from "../../components/Type/Type";
import { Button, CircularProgress } from "@material-ui/core";
import { useConfirmEmailController } from "./useConfirmEmailController";

export type ConfirmEmailProps = {
}

export function ConfirmEmail(props: ConfirmEmailProps) {

	const controller = useConfirmEmailController()

	return <div className="ConfirmEmail">

		<Type
			component="h1"
			variant="bold"
			color="black"
			size="xxl"
		>
			{"Confirm your email"}
		</Type>

		<main>
			{(() => {

				switch (controller.success) {

					case undefined:

						return <CircularProgress />

					case false:

						return <>

							<Type color="red-600">
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

					case true:

						return <>

							<Type color="green-600" variant="bold" component="h2" size="lg">
								{"Email succesfully confirmed"}
							</Type>

							<Button
								variant="contained"
								color="primary"
								onClick={controller.handleLogin}
								fullWidth
							>
								{"Login"}
							</Button>

						</>

				}

			})()}
		</main>

	</div>
}