import c from "./styles/shell.module.scss";

export default function Shell({ children }) {
  return <div className={c.shell}>{children}</div>;
}
