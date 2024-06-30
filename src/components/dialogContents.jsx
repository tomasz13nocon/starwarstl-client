import * as Dialog from "@radix-ui/react-dialog";
import Icon from "@mdi/react";
import { mdiClose } from "@mdi/js";
import c from "./styles/dialogContents.module.scss";
import clsx from "clsx";

export default function DialogContents({ children, title, small = false }) {
  return (
    <Dialog.Portal>
      <Dialog.Overlay className={c.overlay} />
      <Dialog.Content className={clsx(c.content, small && c.small)}>
        <div className={c.header}>
          <Dialog.Title className={clsx(c.title, small && c.small)}>{title}</Dialog.Title>
          <Dialog.Close className={c.close}>
            <Icon className={`icon`} path={mdiClose} size={1.5} />
          </Dialog.Close>
        </div>
        {children}
      </Dialog.Content>
    </Dialog.Portal>
  );
}
