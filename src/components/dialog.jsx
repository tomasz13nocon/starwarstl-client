import { useRef } from "react";
import { useDialog } from "react-aria";
import classes from "./styles/dialog.module.scss";

export default function Dialog({ title, children, ...props }) {
  let ref = useRef(null);
  let { dialogProps, titleProps } = useDialog(props, ref);

  return (
    <div {...dialogProps} ref={ref} className={classes.dialog}>
      {title && <h3 {...titleProps}>{title}</h3>}
      {children}
    </div>
  );
}
