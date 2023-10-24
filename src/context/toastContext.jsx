import { createContext, useState } from "react";

export const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  function pushToast(toast) {
    toast.timestamp = Date.now();
    setToasts((prev) => [...prev, toast]);
  }

  function removeToast(toast) {
    setToasts((prev) => prev.filter((t) => t.timestamp !== toast.timestamp));
  }

  return (
    <ToastContext.Provider value={{ toasts, pushToast, removeToast }}>
      {children}
    </ToastContext.Provider>
  );
};
