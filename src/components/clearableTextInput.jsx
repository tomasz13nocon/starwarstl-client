import React from "react";
import { Icon } from "@mdi/react";
import { mdiClose } from "@mdi/js";
import "./styles/clearableTextInput.scss";

export default function ClearableTextInput({ children, small, active, value, onChange, ...props }) {
  const id = React.useRef(Math.random().toString(36).substring(2));
  return (
    <>
      <label htmlFor={id.current} className="range-input-label">
        {children}
      </label>
      <div id={id.current} className="clear-input-container">
        <input
          type="text"
          className={`input-default ${small ? "small" : ""} ${active ? "active" : ""}`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          {...props}
        />
        {value && (
          <button
            className="clear-input"
            onClick={() => {
              onChange("");
            }}
            aria-label="Clear search"
          >
            <Icon className={`icon`} path={mdiClose} size={small ? 0.94 : 1.12} />
          </button>
        )}
      </div>
    </>
  );
}
