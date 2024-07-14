import clsx from "clsx";
import c from "./styles/itemShield.module.scss";

export default function ItemShield({ item }) {
  return <div className={clsx(item.fullType ?? item.type, c.toastItemTitle)}>{item.title}</div>;
}
