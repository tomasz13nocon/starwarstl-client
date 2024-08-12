import clsx from "clsx";
import c from "./styles/shell.module.scss";

export default function Shell({ children, noMargin }) {
  return <div className={clsx(c.shell, noMargin && c.noMargin)}>{children}</div>;
}
