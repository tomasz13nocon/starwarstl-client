import Icon from "@mdi/react";
import React from "react";

import "./styles/checkbox.scss";

import { blurIfMouse } from "./util.js";

export default React.memo(function Checkbox({
  name,
  value,
  onChange,
  path,
  indeterminate = false,
  icon,
  iconOnClick,
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
      className={`checkbox-wrapper level-${(path?.match(/\./g) || []).length}`}
    >
      <label onContextMenu={path === undefined ? undefined : solo}>
        <input
          type="checkbox"
          checked={value}
          onChange={handleChange}
          ref={checkboxRef}
        />
        <span className={`checkbox ${current} ${animClass}`}></span>
        <span className={`checkbox-text ${path ? "type-indicator-filter" : ""} ${path ? path.split(".").pop() : ""}`}>{name}</span>
      </label>
      {icon !== undefined && (
        <Icon
          onClick={iconOnClick}
          path={icon}
          className="icon expand-button"
        />
      )}
    </div>
  );
});
