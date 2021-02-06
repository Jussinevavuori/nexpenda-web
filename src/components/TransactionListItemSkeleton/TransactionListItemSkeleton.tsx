import "./TransactionListItemSkeleton.scss";
import React, { useState } from "react"
import { Skeleton } from "@material-ui/lab";
import { useRandomValue } from "../../hooks/utils/useRandomValue";

export type TransactionListItemSkeletonProps = {
	i: number;
}

export function TransactionListItemSkeleton(props: TransactionListItemSkeletonProps) {

	const headerWidth = useRandomValue(48, 64)
	const categoryWidth = useRandomValue(20, 40)
	const commentWidth = useRandomValue(20, 80)
	const amountWidth = useRandomValue(32, 64)

	const [shouldShowHeader] = useState(() => props.i === 0 || Math.random() < 0.3)

	return <div className="TransactionListItemSkeleton">
		{
			shouldShowHeader && (
				<div className="TransactionListItemSkeletonHeader" >
					<Skeleton variant="rect" width={headerWidth} height="100%" animation="wave" />
				</div>
			)
		}
		<div className="TransactionListItemSkeletonBody">
			<div className="icon">
				<Skeleton variant="circle" width="100%" height="100%" animation="wave" />
			</div>
			<div className="category">
				<Skeleton variant="rect" width={categoryWidth + "%"} height="100%" animation="wave" />
			</div>
			<div className="comment">
				<Skeleton variant="rect" width={commentWidth + "%"} height="100%" animation="wave" />
			</div>
			<div className="amount">
				<Skeleton variant="rect" width={amountWidth} height="100%" animation="wave" />
			</div>
		</div>
	</div >
}