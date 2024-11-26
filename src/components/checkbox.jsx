import { blurIfMouse } from "@/util";
import c from "./styles/checkbox.module.scss";
import { memo, useEffect, useMemo, useRef } from "react";
import clsx from "clsx";

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
  const animClass = useMemo(() => {
    return prevRef.current
      ? prevRef.current + "To" + current[0].toUpperCase() + current.slice(1)
      : "";
  }, [current]);
  useEffect(() => {
    prevRef.current = current;
  });

  return (
    <div className={clsx(c.checkboxWrapper, wrapperClassName)}>
      <label {...labelProps}>
        <input type="checkbox" checked={value} onChange={handleChange} ref={checkboxRef} />
        <span className={clsx(c.checkbox, c[current], c[animClass])}></span>
        {name && <span className={clsx(c.checkboxText, textClassName)}>{name}</span>}
      </label>
      {children}
    </div>
  );
});
