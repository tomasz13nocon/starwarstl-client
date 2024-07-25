import { createContext, useCallback, useContext, useState } from "react";

const ToastContext = createContext();

export const useToast = () => {
  return useContext(ToastContext);
};

let counter = 0;

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const pushToast = useCallback((toast) => {
    toast.id = counter++;
    setToasts((prev) => [...prev, toast]);
  }, []);

  const pushErrorToast = useCallback((error) => {
    pushToast({ title: error.message, error: true });
  }, []);

  const removeToast = useCallback((toast) => {
    setToasts((prev) => prev.filter((t) => t.id !== toast.id));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, pushToast, pushErrorToast, removeToast }}>
      {children}
    </ToastContext.Provider>
  );
};
