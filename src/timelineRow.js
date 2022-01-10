import React from "react";

import TimelineRowDetails from "./timelineRowDetails";

export default function TimelineRow({ item, activeColumns }) {

	const [expanded, toggleExpanded] = React.useReducer(state => {
		return /* window.getSelection().type === "Range" ? state : */ !state;
	}, false);

	const cells = activeColumns.map(columnName => {
		let inside;
		switch (columnName) {
			case "cover":
				inside = <img src={item.cover} />;
				break;
			case "author":
				inside = item.author || item.writer;
				break;
			case "title":
				// Button for accessiblity
				return (
					<td
						key={item.id + columnName}
						className={columnName + " " + item.type}
						onClick={toggleExpanded}>
						<button name="expand">{item[columnName]}</button>
					</td>
				);
			default:
				inside = item[columnName];
		}
		return (
			<td key={item.id + columnName} className={columnName}>
				{inside}
			</td>
		);
	});

	return (
		<>
			<tr className={"standard-row"}>
				{cells}
			</tr>
			<TimelineRowDetails expanded={expanded} item={item} colspan={activeColumns.length} />
		</>
	);
}