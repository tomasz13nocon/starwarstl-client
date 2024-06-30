import React, { forwardRef, useEffect, useState } from "react";
import { Icon } from "@mdi/react";
import { mdiClose } from "@mdi/js";
import c from "./styles/clearableTextInput.module.scss";
import clsx from "clsx";

export default forwardRef(function ClearableTextInput(
  { children, small, active, value, onChange, bullet, clearBullet, ...props },
  ref,
) {
  const id = React.useRef(Math.random().toString(36).substring(2));
  const bulletRef = React.useRef(null);
  const [bulletPadding, setBulletPadding] = useState(0);
  useEffect(() => {
    setBulletPadding(bulletRef.current?.offsetWidth || 0);
  });

  return (
    <>
      <label htmlFor={id.current}>{children}</label>
      <div className={c.clearInputContainer}>
        {bullet && (
          <button className={c.bullet} ref={bulletRef} onClick={clearBullet}>
            {bullet}:
          </button>
        )}
        <input
          type="text"
          id={id.current}
          className={clsx(small && "small", active && c.active)}
          style={bullet ? { paddingLeft: `${bulletPadding + 10}px` } : {}}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          ref={ref}
          {...props}
        />
        {(value || bullet) && (
          <button
            className={c.clearInput}
            onClick={() => {
              onChange("");
              if (clearBullet) clearBullet();
            }}
            aria-label="Clear search"
          >
            <Icon className={`icon`} path={mdiClose} size={small ? 0.94 : 1.12} />
          </button>
        )}
      </div>
    </>
  );
});
