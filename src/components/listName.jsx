import clsx from "clsx";
import Icon from "./icon";
import c from "./styles/listName.module.scss";
import { listIcons } from "@/util";

export default function ListName({ name, iconSize, className, props }) {
  const icon = listIcons[name]?.default;

  return (
    <span className={clsx(c.container, className)} {...props}>
      {icon && <Icon path={icon} size={iconSize ?? 0.9} />}
      <span>{name}</span>
    </span>
  );
}
