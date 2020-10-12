import "./PageHeader.scss";
import React from "react"
import textureImg from "../../images/pexels-johannes-plenio-1103970.jpg"

export type PageHeaderProps = {
	children: React.ReactNode;
}

export function PageHeader(props: PageHeaderProps) {
	return <header className="PageHeader">
		<img src={textureImg} alt="" className="texture" />
		<div className="pageHeaderChildren">
			{props.children}
		</div>
	</header>
}