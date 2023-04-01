import React from "react";
import { blurIfMouse } from "@/util";
import "./styles/radio.scss";

export default React.memo(function Checkbox({
  checked,
  onChange,
  children,
}) {
    const handleChange = (e) => {
      onChange();
      blurIfMouse(e);
    };

    return (
      <div
        className={`radio-wrapper`}
      >
        <label>
          <input type="radio" onChange={handleChange} checked={checked} />
          <span className={`radio ${checked ? "checked" : ""}`}></span>
          <span className={`radio-text`}>{children}</span>
        </label>
      </div>
    );
  });

