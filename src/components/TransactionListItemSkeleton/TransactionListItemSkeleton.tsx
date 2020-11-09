import "./TransactionListItemSkeleton.scss";
import React, { useState } from "react"
import { Skeleton } from "../Skeleton/Skeleton";

export type TransactionListItemSkeletonProps = {
	i: number;
}

export function TransactionListItemSkeleton(props: TransactionListItemSkeletonProps) {

	const [shouldShowHeader] = useState(() => props.i === 0 || Math.random() < 0.3)

	return <div className="TransactionListItemSkeleton">
		{
			shouldShowHeader && <div className="TransactionListItemSkeletonHeader" >
				<Skeleton
					width={{ min: 48, max: 64, unit: "px" }}
					height="100%"
				/>
			</div>
		}
		<div className="TransactionListItemSkeletonBody">
			<div className="icon">
				<Skeleton
					className="iconSkeleton"
					width="100%"
					height="100%"
				/>
			</div>
			<div className="category">
				<Skeleton
					width={{ min: 20, max: 40, unit: "%" }}
					height="100%"
				/>
			</div>
			<div className="comment">
				<Skeleton
					width={{ min: 20, max: 80, unit: "%" }}
					height="100%"
				/>
			</div>
			<div className="amount">
				<Skeleton
					width={{ min: 32, max: 64, unit: "px" }}
					height="100%"
				/>
			</div>
		</div>
	</div>
}