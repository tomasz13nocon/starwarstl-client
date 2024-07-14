import clsx from "clsx";
import { mdiClose } from "@mdi/js";
import Icon from "./icon";

import c from "./styles/filterBullet.module.scss";

export default function FilterBullet({
  className,
  contentClassName,
  buttonClassName,
  buttonOnClick,
  children,
}) {
  return (
    <div className={clsx(c.filterBullet, className)}>
      <div className={clsx(c.content, contentClassName)}>{children}</div>
      <button className={clsx(c.closeButton, buttonClassName)} onClick={buttonOnClick}>
        <Icon className={c.icon} path={mdiClose} size={0.9166666} />
      </button>
    </div>
  );
}
