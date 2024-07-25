import React from "react";
import { blurIfMouse } from "@/util";
import c from "./styles/radio.module.scss";
import clsx from "clsx";

export default React.memo(function Radio({ checked, onChange, children }) {
  const handleChange = (e) => {
    onChange();
    blurIfMouse(e);
  };

  return (
    <div className={c.radioWrapper}>
      <label>
        <input type="radio" onChange={handleChange} checked={checked} />
        <span className={clsx(c.radio, checked && c.checked)}></span>
        <span className={c.radioText}>{children}</span>
      </label>
    </div>
  );
});
