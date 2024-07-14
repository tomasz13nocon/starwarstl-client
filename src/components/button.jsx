import { forwardRef } from "react";
import clsx from "clsx";
import c from "./styles/button.module.scss";

export default forwardRef(function Button(
  { children, className, primary, active, inverted, soft, danger, ...props },
  ref,
) {
  return (
    <>
      <button
        className={clsx(
          c.btn,
          primary && c.primary,
          danger && c.danger,
          active && c.active,
          inverted && c.inverted,
          soft && c.soft,
          className,
        )}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    </>
  );
});
