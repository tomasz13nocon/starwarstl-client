import { useContext } from "react";
import c from "./styles/toasts.module.scss";
import * as Toast from "@radix-ui/react-toast";
import { ToastContext } from "@/context/toastContext";

export default function Toasts() {
  const { toasts, removeToast } = useContext(ToastContext);

  return (
    <Toast.Provider className={c.provider}>
      {toasts.map((toast) => (
        <Toast.Root
          className={c.root}
          key={toast.timestamp}
          onOpenChange={(open) => {
            if (!open) removeToast(toast);
          }}
        >
          <Toast.Title className={c.title}>{toast.title}</Toast.Title>
          {toast.description && (
            <Toast.Description className={c.description}>{toast.description}</Toast.Description>
          )}

          {/* <Toast.Action /> */}
          {/* <Toast.Close /> */}
        </Toast.Root>
      ))}
      <Toast.Viewport className={c.viewport} />
    </Toast.Provider>
  );
}
