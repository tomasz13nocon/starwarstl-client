import * as Dialog from "@radix-ui/react-dialog";
import { mdiClose } from "@mdi/js";
import c from "./styles/dialogContents.module.scss";
import clsx from "clsx";
import Icon from "./icon";

export default function DialogContents({ children, title, description, small = false }) {
  const contentProps = {};
  if (!description) contentProps["aria-describedby"] = undefined;

  return (
    <Dialog.Portal>
      <Dialog.Overlay className={c.overlay} />
      <Dialog.Content className={clsx(c.content, small && c.small)} {...contentProps}>
        <div className={c.header}>
          <Dialog.Title className={clsx(c.title, small && c.small)}>{title}</Dialog.Title>
          <Dialog.Close className={c.close}>
            <Icon path={mdiClose} size={1.5} />
          </Dialog.Close>
        </div>
        {description ? <Dialog.Description>{description}</Dialog.Description> : null}
        {children}
      </Dialog.Content>
    </Dialog.Portal>
  );
}
