import clsx from "clsx";
import { Icon } from "@mdi/react";
import { mdiClose } from "@mdi/js";

import c from "./styles/filterBullet.module.scss";

export default function FilterBullet({
  className,
  contentClassName,
  buttonClassName,
  buttonOnClick,
  children,
  ...props
}) {
  return (
    <div className={clsx(c.filterBullet, className)}>
      <div className={clsx(c.content, contentClassName)}>{children}</div>
      <button className={clsx(c.closeButton, buttonClassName)} onClick={buttonOnClick}>
        <Icon className={`icon`} path={mdiClose} />
      </button>
    </div>
  );
}
