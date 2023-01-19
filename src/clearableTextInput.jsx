import React from "react";
import _ from "lodash";

export default function ClearableTextInput(p) {
  const id = React.useRef(Math.random().toString(36).substring(2));
  return (
    <>
      <label htmlFor={id.current} className="range-input-label">
        {p.children}
      </label>
      <div id={id.current} className="search clear-input-container">
        <input type="text" className={`input-default ${p.small ? "small" : ""}`} value={p.value} onChange={(e) => p.onChange(e.target.value)} />
        {p.value &&
          <button
            className="clear-input"
            onClick={(e) => {
              p.onChange("");
            }}
            aria-label="Clear search"
          >
            &times;
          </button>
        }
      </div>
    </>
  );
}
