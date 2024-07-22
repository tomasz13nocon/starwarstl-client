import { blurIfMouse } from "@/util";
import "./styles/checkbox.scss";
import { memo, useEffect, useRef } from "react";

export default memo(function Checkbox({
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
    onChange(indeterminate ? false : !value);
    blurIfMouse(e);
  };

  const checkboxRef = useRef();
  useEffect(() => {
    checkboxRef.current.indeterminate = indeterminate;
  }, [indeterminate]);

  // make animClass {previousState}-to-{currentState}, empty by default
  const current = indeterminate ? "indeterminate" : value ? "checked" : "unchecked";
  const prevRef = useRef();
  let animClass = prevRef.current ? prevRef.current + "-to-" + current : "";
  useEffect(() => {
    prevRef.current = current;
  }, [current]);

  return (
    <div className={`checkbox-wrapper ${wrapperClassName ?? ""}`}>
      <label {...labelProps}>
        <input type="checkbox" checked={value} onChange={handleChange} ref={checkboxRef} />
        <span className={`checkbox ${current} ${animClass}`}></span>
        {name && <span className={`checkbox-text ${textClassName ?? ""}`}>{name}</span>}
      </label>
      {children}
    </div>
  );
});
