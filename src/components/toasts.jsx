import { useContext } from "react";
import c from "./styles/toasts.module.scss";
import * as Toast from "@radix-ui/react-toast";
import { ToastContext } from "@/context/toastContext";
import Icon from "@mdi/react";
import { mdiClose } from "@mdi/js";

// Can be larger that the actual animation
const TOAST_CLOSE_DURATION = 1000;

export default function Toasts() {
  const { toasts, removeToast } = useContext(ToastContext);

  return (
    <Toast.Provider className={c.provider} duration="3000">
      {toasts.map((toast) => (
        <Toast.Root
          className={c.root}
          key={toast.timestamp}
          onOpenChange={(open) => {
            if (!open) setTimeout(() => removeToast(toast), TOAST_CLOSE_DURATION);
          }}
        >
          <Toast.Title className={c.title}>{toast.title}</Toast.Title>
          {toast.description && (
            <Toast.Description className={c.description}>{toast.description}</Toast.Description>
          )}

          {/* <Toast.Action /> */}
          <Toast.Close className={c.close} aria-label="Close">
            <Icon className={`icon`} path={mdiClose} size={1.12} />
          </Toast.Close>
        </Toast.Root>
      ))}
      <Toast.Viewport className={c.viewport} />
    </Toast.Provider>
  );
}
