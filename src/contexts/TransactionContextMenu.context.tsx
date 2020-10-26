import React, { useContext, useState } from "react";
import { Transaction } from "../classes/Transaction";
import { TransactionContextMenu } from "../components/TransactionContextMenu/TransactionContextMenuController";

type TransactionContextMenuContextType = {
	transaction?: Transaction | undefined;
	setTransaction(transaction: Transaction | undefined): void;
	position?: { top: number, left: number } | undefined;
	setPosition(origin: { top: number, left: number } | undefined): void;
}

const TransactionContextMenuContext = React.createContext<TransactionContextMenuContextType>(
	{
		setPosition() { throw new Error(`Using default TransactionContextMenuContext value`) },
		setTransaction() { throw new Error(`Using default TransactionContextMenuContext value`) }
	}
)

export function useTransactionContextMenu() {
	return useContext(TransactionContextMenuContext)
}

export function TransactionContextMenuProvider(
	props: { children?: React.ReactNode }
) {

	const [position, setPosition] = useState<{ top: number, left: number }>()

	const [transaction, setTransaction] = useState<Transaction>()

	return <TransactionContextMenuContext.Provider value={{
		position,
		setPosition,
		transaction,
		setTransaction
	}}>
		<TransactionContextMenu />
		{props.children}
	</TransactionContextMenuContext.Provider>
}