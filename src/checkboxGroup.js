import React from "react";
import _ from "lodash";

import Checkbox from "./checkbox.js";

// for a given object returns, depending on the state of its children, recursively:
// 0 - all unchecked
// 1 - mixed (indeterminate)
// 2 - all checked
const areChildrenChecked = children => {
	let prev, checked;
	for (let value of Object.values(children)) {
		if (typeof value === "boolean") {
			checked = value;
		}
		else {
			let childrenChecked = areChildrenChecked(value);
			if (childrenChecked === 1) return 1;
			checked = (childrenChecked === 2);
		}

		if (prev === undefined) {
			prev = checked;
		}
		else if (checked !== prev) {
			return 1;
		}
	}
	return prev ? 2 : 0;
};

// children must be an object
// path - path in the state object, not template
// state - sub state of a nested state
export default function CheckboxGroup({ name, state, onChange, path, children }) {
	let childrenChecked = areChildrenChecked(state);

	let recursiveGroupOrLeafs = Object.entries(children).map(([key, value]) => {
		let finalPath = path ? path + "." + key : key;
		// Leaf Checkbox
		// both of these ↓      ↓ should provide the same result
		if (typeof /*value*/ state[key] === "boolean" || value.value !== undefined) {
			return <Checkbox
				key={finalPath}
				name={value.name || key}
				value={state[key]}
				onChange={onChange}
				path={finalPath} />;
		}
		// Recursive group
		else {
			return (
				<CheckboxGroup
					key={finalPath}
					name={value.name !== undefined ? value.name : key}
					state={state[key]}
					onChange={onChange}
					path={finalPath}>
					{value.children || value}
				</CheckboxGroup>
			);
		}
	});

	// If name was not passed or is null, just recurse without creating the outer divs.
	if (!name) return recursiveGroupOrLeafs;

	return (
		<div className="checkbox-group">
			{/* group checkbox */}
			<div className={`checkbox-group-title level-${(path.match(/\./g) || []).length}`}>
				<Checkbox
					name={name}
					value={childrenChecked === 2}
					indeterminate={childrenChecked === 1}
					onChange={onChange}
					path={path} />
			</div>

			{/* leaf checkboxes or recursive contents of a group */}
			<div className="checkbox-group-contents">
				{recursiveGroupOrLeafs}
			</div>
		</div>
	);
};
