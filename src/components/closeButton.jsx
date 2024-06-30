import clsx from "clsx";
import c from "./styles/closeButton.module.scss";
import { mdiClose } from "@mdi/js";
import { Icon } from "@mdi/react";

export default function CloseButton({ animated = false, size, ...props }) {
  return (
    <button className={c.button} {...props}>
      <Icon
        className={clsx("icon", animated ? "animated" : "colored")}
        path={mdiClose}
        size={size}
      />
    </button>
  );
}
