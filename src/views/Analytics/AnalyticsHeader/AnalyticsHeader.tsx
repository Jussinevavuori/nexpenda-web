import "./AnalyticsHeader.scss";
import React from "react";
import textureImg from "../../../images/shapelined-_JBKdviweXI-unsplash.jpg";
import { Type } from "../../../components/Type/Type";
import { useAnalyticsHeaderController } from "./useAnalyticsHeaderController";
import { useMdMedia } from "../../../hooks/utils/useMedia";


export function AnalyticsHeader() {

	const controller = useAnalyticsHeaderController()

	const isDesktop = useMdMedia()

	if (isDesktop) {
		return <header className="AnalyticsHeader desktop">

			<div className="title">
				<Type component="h1" size="xl" color="gray-900" variant="bold">
					{"Analytics"}
				</Type>
				<Type component="h2" size="xl" color="gray-600" variant="bold">
					{controller.intervalLabel}
				</Type>
			</div>

		</header>
	}

	else {

		return <header className="AnalyticsHeader mobile">


			<div className="texture-image-container">
				<img src={textureImg} alt="" />
			</div>

			<div className="title">
				<Type component="h1" size="xl" color="white" variant="bold">
					{"Analytics"}
				</Type>
				<Type component="h2" size="xl" color="blue-300" variant="bold">
					{controller.intervalLabel}
				</Type>
			</div>

		</header>

	}

}