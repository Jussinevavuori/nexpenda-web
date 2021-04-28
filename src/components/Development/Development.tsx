import "./Development.scss";
import React from "react";
import cx from "classnames";
import { Config } from "../../config";
import { useAuth } from "../../hooks/application/useAuth";

export type DevelopmentProps = {
	children: React.ReactNode;
};

/**
 * Renders the children only when in development or as an admin
 */
export function Development(props: DevelopmentProps) {
	const user = useAuth()

	if (Config.isEnvironment("development") || user?.isAdmin) {
		return props.children
	}

	return null
}