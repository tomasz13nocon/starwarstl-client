import clsx from "clsx";
import c from "./styles/alert.module.scss";

// type = "error" | "warning" | "info" | "success"
export default function Alert({ type = "error", slim, alert, className, children }) {
  if (alert === null) return;
  if (alert) {
    type = alert.type;
    children = alert.message;
  }
  return <div className={clsx(c.alert, c[type], slim && c.slim, className)}>{children}</div>;
}
