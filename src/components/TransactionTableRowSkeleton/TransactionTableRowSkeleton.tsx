import "./TransactionTableRowSkeleton.scss";
import React from "react"
import { Skeleton } from "@material-ui/lab";
import { useRandomValue } from "../../hooks/utils/useRandomValue";

export type TransactionTableRowSkeletonProps = {

}

export function TransactionTableRowSkeleton(props: TransactionTableRowSkeletonProps) {

	const categoryWidth = useRandomValue(20, 90)
	const amountWidth = useRandomValue(48, 64)
	const commentWidth = useRandomValue(20, 80)
	const dateWidth = useRandomValue(48, 64)

	return <div className="TransactionTableRowSkeleton">
		<div className="action" >
			<Skeleton variant="rect" width={20} height={20} animation="wave" />
		</div>
		<div className="category">
			<Skeleton variant="rect" width={categoryWidth + "%"} height={16} animation="wave" />
		</div>
		<div className="amount">
			<Skeleton variant="rect" width={amountWidth} height={16} animation="wave" />
		</div>
		<div className="comment">
			<Skeleton variant="rect" width={commentWidth + "%"} height={16} animation="wave" />
		</div>
		<div className="date">
			<Skeleton variant="rect" width={dateWidth} height={16} animation="wave" />
		</div>
	</div>
}