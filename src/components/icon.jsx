import { Icon as MdiIcon } from "@mdi/react";
import clsx from "clsx";

import c from "./styles/icon.module.scss";

export default function Icon({ className, size = 1, ...props }) {
  return <MdiIcon className={clsx(c.icon, className)} size={size} {...props} />;
}
