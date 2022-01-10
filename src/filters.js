import React from "react";
import _ from "lodash";

import CheckboxGroup from "./checkboxGroup.js";
import "./styles/filters.scss";

export default function Filters({ filterText, filterTextChanged, filters, filtersChanged, filtersTemplate }) {
	return (
		<div className="filter">
			<div className="search">
				<input
					type="text"
					value={filterText}
					onChange={e => filterTextChanged(e.target.value)}
					placeholder="Search..." />
				{filterText ?
					<button className="clear-input" onClick={e => filterTextChanged("")} aria-label="Clear search">&times;</button>
					: null}
			</div>

			<div className="checkbox-filters">
				<CheckboxGroup state={filters} onChange={filtersChanged}>
					{filtersTemplate}
				</CheckboxGroup>
			</div>
		</div>
	);
};
