import c from "./styles/toasts.module.scss";
import * as Toast from "@radix-ui/react-toast";
import { useToast } from "@/context/toastContext";
import { mdiClose, mdiExclamationThick } from "@mdi/js";
import Icon from "./icon";
import clsx from "clsx";

// Can be larger that the actual animation
const TOAST_CLOSE_DURATION = 1000;

export default function Toasts() {
  const { toasts, removeToast } = useToast();

  return (
    <Toast.Provider className={c.provider} duration="3000">
      {toasts.map((toast) => (
        <Toast.Root
          className={clsx(c.root, toast.error && c.error)}
          key={toast.id}
          onOpenChange={(open) => {
            if (!open) setTimeout(() => removeToast(toast), TOAST_CLOSE_DURATION);
          }}
        >
          <Toast.Title className={c.title}>
            {toast.error && <Icon path={mdiExclamationThick} className={c.errorIcon} />}
            {toast.icon ? (
              <>
                <Icon path={toast.icon} className={clsx(c.icon, c[toast.type])} />
                <span>{toast.title}</span>
              </>
            ) : (
              toast.title
            )}
          </Toast.Title>
          {toast.description && (
            <Toast.Description className={c.description}>{toast.description}</Toast.Description>
          )}

          {/* <Toast.Action /> */}
          <Toast.Close className={c.close} aria-label="Close">
            <Icon path={mdiClose} size={1.12} />
          </Toast.Close>
        </Toast.Root>
      ))}
      <Toast.Viewport className={c.viewport} />
    </Toast.Provider>
  );
}
