import React from "react";
import { blurIfMouse } from "@/util";
import "./styles/checkbox.scss";

export default React.memo(function Checkbox({
  name,
  value,
  onChange,
  indeterminate = false,
  wrapperClassName,
  textClassName,
  labelProps,
  children,
}) {
    const handleChange = (e) => {
      onChange(indeterminate ? false : !value );
      blurIfMouse(e);
    };

    const checkboxRef = React.useRef();
    React.useEffect(() => {
      checkboxRef.current.indeterminate = indeterminate;
    }, [indeterminate]);

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
        className={`checkbox-wrapper ${wrapperClassName ?? ""}`}
      >
        <label {...labelProps}>
          <input
            type="checkbox"
            checked={value}
            onChange={handleChange}
            ref={checkboxRef}
          />
          <span className={`checkbox ${current} ${animClass}`}></span>
          <span className={`checkbox-text ${textClassName ?? ""}`}>{name}</span>
        </label>
        {children}
      </div>
    );
  });

