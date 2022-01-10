import React from "react";
import { mdiOpenInNew } from '@mdi/js';
import Icon from "@mdi/react";

export default function ExternalLink({ children, ...props }) {
	return (
		<a className="external" {...props}>
			{children}
			<Icon path={mdiOpenInNew} className="icon" />
		</a>
	);
};
