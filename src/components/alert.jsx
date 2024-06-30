import clsx from "clsx";
import c from "./styles/alert.module.scss";

// type = "error" | "warning" | "info" | "success"
export default function Alert({ type = "error", children }) {
  return <div className={clsx(c.alert, c[type])}>{children}</div>;
}
