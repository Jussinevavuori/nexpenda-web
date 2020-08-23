import React from "react";
import { TransactionList } from "../../components/TransactionList/TransactionList";
import { Auth } from "../../models/authentication/auth.class";

export type DashboardTabViewProps = {
	user: Auth;
}

export function DashboardTabView(props: DashboardTabViewProps) {

	return <div>

		<header>

			<h1 >
				{`Welcome back, ${props.user.displayName}`}
			</h1>

		</header>

		<section>

			<TransactionList />

		</section>

	</div>

}