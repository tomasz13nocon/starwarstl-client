import React from "react";

import "./styles/checkbox.scss";

import { blurIfMouse } from "./util.js";

export default function Checkbox({
  name,
  value,
  onChange,
  path,
  indeterminate = false,
}) {
  const checkboxRef = React.useRef();
  React.useEffect(() => {
    checkboxRef.current.indeterminate = indeterminate;
  }, [indeterminate]);

  const handleChange = (e) => {
    onChange({ path: path, to: indeterminate ? false : !value });
    blurIfMouse(e);
  };

  const solo = (e) => {
    onChange({ path: path.split(".")[0], to: false });
    onChange({ path: path, to: true });
    blurIfMouse(e);
    e.preventDefault();
  };

  // make animClass {previousState}-to-{currentState}, empty by default
  const current = indeterminate
    ? "indeterminate"
    : value
    ? "checked"
    : "unchecked";
  const prevRef = React.useRef();
  let animClass = prevRef.current ? prevRef.current + "-to-" + current : "";
  prevRef.current = current;

  return (
    <div
      className={`checkbox-wrapper level-${(path.match(/\./g) || []).length}`}
    >
      <label onContextMenu={solo}>
        <input
          type="checkbox"
          checked={value}
          onChange={handleChange}
          ref={checkboxRef}
        />
        <span className={`checkbox ${current} ${animClass}`}></span>
        {/* <div title="solo" className="solo-button" onClick={solo}> */}
        {/*   <span>s</span> */}
        {/* </div> */}
        <span className="checkbox-text">{name}</span>
      </label>
    </div>
  );
}
