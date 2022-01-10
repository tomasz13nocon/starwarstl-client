import { mdiLanguageRust } from "@mdi/js";
import React from "react";

import { blurIfMouse } from "./util.js";

export default function Checkbox({ name, value, onChange, path, indeterminate = false }) {

	const checkboxRef = React.useRef();
	React.useEffect(() => {
		checkboxRef.current.indeterminate = indeterminate;
	}, [indeterminate]);

	const handleChange = e => {
		onChange({ path: path, to: indeterminate ? false : !value });
		blurIfMouse(e);
  }
  
  // make animClass {previousState}-to-{currentState}, empty by default
  const current = indeterminate ? "indeterminate" : (value ? "checked" : "unchecked");
  const prevRef = React.useRef();
  let animClass = prevRef.current ? prevRef.current + "-to-" + current : "";
  prevRef.current = current;

	return (
		<div className="checkbox-wrapper">
			<label>
				<input
					type="checkbox"
					checked={value}
					onChange={handleChange}
					ref={checkboxRef} />
        <span className={`checkbox ${current} ${animClass}`}></span>
				<span>{name}</span>
			</label>
			{/* <button className="solo-button">S</button> */}
		</div>
	)
};
