import clsx from "clsx";
import c from "./styles/circleButton.module.scss";
import { forwardRef } from "react";

export default forwardRef(function CircleButton({ className, children, ...props }, ref) {
  return (
    <button className={clsx(c.circleButton, className)} {...props} ref={ref}>
      {children}
    </button>
  );
});
